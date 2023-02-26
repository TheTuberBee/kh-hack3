from flask import Flask, request, jsonify, Response, make_response
from flask_mongoengine import MongoEngine
from flask_uploads import UploadSet, configure_uploads, IMAGES
import os
from api.models import *
from http import HTTPStatus
import json
from flask_cors import CORS, cross_origin
from api.matchmaking import *
from recognition import *

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]

DB_URI = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@demo.kbudhed.mongodb.net/?retryWrites=true&w=majority"

app.config["MONGODB_HOST"] = DB_URI
db = MongoEngine(app)


def authenticate():
    try:
        auth_token = request.headers.get("Authorization")
        if auth_token is None:
            return User.Permissions()

        token = auth_token.split(" ")[1]
        return User.authenticate_token(token)
    except KeyError:
        # fall back to default permissions
        return User.Permissions()


def _login_password(email: str, password: str):
    email = request.args.get("email")
    password = request.args.get("password")

    try:
        email = email.lower()
        user = User.objects(email=email)[0]
    except:
        return "There is no account associated with this email.", HTTPStatus.BAD_REQUEST

    if not user.check_password(password):
        return "Wrong password.", HTTPStatus.BAD_REQUEST

    token = User.issue_token(str(user.pk))
    res = jsonify(user_id=str(user.pk), token=str(token))
    res.set_cookie(
        key="token",
        value=token,
        max_age=400 * 24 * 3600,
        httponly=False
    )
    return res


def _login_reissue(token: str):
    new, user_id = User.reissue_token(token)
    if new is None:
        return "Token invalid or account was modified and must relogin.", HTTPStatus.BAD_REQUEST
    res = jsonify(user_id=user_id, token=token)
    res.set_cookie(
        key="token",
        value=new,
        max_age=400 * 24 * 3600,
        httponly=False
    )
    return res


@app.get("/login")
@cross_origin()
def login_get():
    email = request.args.get("email")
    password = request.args.get("password")
    try:
        old = request.headers.get("Authorization").split(" ")[1]
    except:
        old = None

    if email is not None and password is not None:
        return _login_password(email, password)

    if old is not None:
        return _login_reissue(old)

    return "Invalid combination of credentials.", HTTPStatus.BAD_REQUEST


@app.post("/user")
@cross_origin()
def user_post():
    email: str = request.args.get("email", type=str)
    password: str = request.args.get("password", type=str)
    staff: bool = request.args.get("staff", type=json.loads)
    name: str = request.args.get("name", type=str)

    if email is None or password is None or name is None:
        return "Bad request.", HTTPStatus.BAD_REQUEST

    perms = authenticate()
    if staff is True and not perms.is_staff():
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED

    email = email.lower()
    if User.objects(email=email).count() > 0:
        return "Email already used.", HTTPStatus.BAD_REQUEST

    user = User()

    user.email = email
    user.set_password(password)
    user.name = name
    if staff is not None:
        user.staff = staff
    user.last_modified = int(time.time())
    user.selected_games = []

    user.save()
    return "", HTTPStatus.CREATED


@app.get("/user/<string:id>")
@cross_origin()
def user_get(id):

    perms = authenticate()

    if not perms.is_staff() and id != perms.user_id:
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED

    user = perms.get_user()
    return {
        "email": user.email,
        "name": user.name,
        "staff": user.staff,
        "selected_games": user.selected_games
    }


@app.get("/leaderboard")
@cross_origin()
def leaderboard_get():

    start_time: int = request.args.get("start_time", type=int)
    end_time: int = request.args.get("end_time", type=int)
    game_id: str = request.args.get("game", type=str)
    restricted: bool = request.args.get("restricted", type=json.loads)
    tournament: bool = request.args.get("tournament", type=json.loads)

    if start_time is None or end_time is None or game_id is None:
        return "Bad Request.", HTTPStatus.BAD_REQUEST

    if restricted is None:
        restricted = False

    if tournament is None:
        tournament = False

    game = Game.objects(pk=game_id)[0]

    def match_filter(match): return (
        start_time <= match.timestamp and match.timestamp <= end_time)

    if restricted:
        _func = match_filter

        def _new(match: Match):
            if not _func(match):
                return False
            for player in match.team_a_players + match.team_b_players:
                if player is None:
                    return False
            return True
        match_filter = _new

    def player_filter(player): return True

    data = Match.analyze(player_filter, match_filter,
                         game, tournament=tournament)
    return data


@app.get("/games")
@cross_origin()
def games_get():
    games = []
    for game in Game.objects:
        game: Game
        games.append({
            "id": str(game.pk),
            "name": game.name,
            "factor_names": game.factor_names,
            "factor_values": game.factor_values,
            "team_size": game.team_size,
        })
    return jsonify(games)


@app.post("/users/<string:id>/selected_games")
@cross_origin()
def games_post(id):
    game: str = request.args.get("game", type=str)

    """
    perms = authenticate()
    if not perms.is_staff() and id != perms.user_id:
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED
    """

    user = User.objects(pk=id)[0]

    user.selected_games.append(Game.objects(pk=game)[0])

    user.save()

    return "", HTTPStatus.CREATED


@app.delete("/users/<string:id>/selected_games")
@cross_origin()
def games_delete(id):
    game: str = request.args.get("game", type=str)

    """
    perms = authenticate()
    if not perms.is_staff() and id != perms.user_id:
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED
    """

    user = User.objects(pk=id)[0]

    user.selected_games.remove(Game.objects(pk=game)[0])

    user.save()

    return "", HTTPStatus.CREATED


def fix():
    for game in Game.objects:
        game.delete()

    Game(
        name="Counter Strike: Global Offensive",
        team_size=5,
        factor_names=["Kills", "Deaths", "Assists"],
        factor_values=[10, -2, 4],
    ).save()

    Game(
        name="League of Legends",
        team_size=5,
        factor_names=["Kills", "Deaths", "Assists"],
        factor_values=[10, -2, 4],
    ).save()

    Game(
        name="Dummy",
        team_size=1,
        factor_names=["Contribution"],
        factor_values=[1],
    ).save()

    for user in User.objects:
        user.delete()

    import secrets
    User(
        email=secrets.token_hex(10),
        name=""
    ).save()

    for match in Match.objects:
        match.delete()

    t = int(time.time())

    Match.add_match(
        timestamp=t,
        team_a_players=[]

    )

# teammate finder


@app.get("/teammate_finder")
@cross_origin()
def teammate_finder_get():
    # authenticate
    # perms = authenticate()

    # if perms.user_id is None:
    #   return "Unauthorized.", HTTPStatus.UNAUTHORIZED
    
    user_id: str = request.args.get("user_id", type = str)

    def player_filter(player): return True
    def match_filter(match): return True
    game = Game.objects(pk="63fa20423cab53f5ff515119")[0]

    all_players_data = Match.analyze(
        player_filter, match_filter, game)["players"]

    player_data = None

    index = 0
    before_player = []
    after_player = []
    # find the player in the all_players_data
    for player in all_players_data:
        if player["id"] == user_id:
            player_data = player

            # split the list into two parts and remove the player
            before_player = all_players_data[:index]
            after_player = all_players_data[index + 1:]

            break
        index += 1

    # create the data for the frontend list
    # data needed: name, elo, email, killcount, deathcount, assistcount

    # create the list of players
    players = []

    index = 0
    # add the players before the player
    for player in before_player:
        if index >= 5:
            break

        # get user's email from the database using the player's id
        user = User.objects(pk = player["id"])[0]

        players.append({
            "name": player["name"],
            "elo": player["rating"],
            "email": user.email,
            "killcount": player["factors"][8],
            "deathcount": player["factors"][2],
            "assistcount": player["factors"][0]
        })
        index += 1

    # get player's email from the database
    user = User.objects(pk=user_id)[0]
    # add the player
    players.append({
        "name": "You",
        "elo": player_data["rating"],
        "email": user.email,
        "killcount": player_data["factors"][8],
        "deathcount": player_data["factors"][2],
        "assistcount": player_data["factors"][0]
    })

    index = 0
    # add the players after the player
    for player in after_player:
        if index >= 5:
            break

        # get user's email from the database using the player's id
        user = User.objects(pk=player["id"])[0]

        players.append({
            "name": player["name"],
            "elo": player["rating"],
            "email": user.email,
            "killcount": player["factors"][8],
            "deathcount": player["factors"][2],
            "assistcount": player["factors"][0]
        })

        index += 1

    return jsonify(players)


photos = UploadSet("photos", IMAGES)
app.config["UPLOADED_PHOTOS_DEST"] = "uploads"
configure_uploads(app, photos)

# fifa match upload


@app.post("/fifa_match_upload")
@cross_origin()
def fifa_match_upload_post():
    if "image" not in request.files:
        return "No image file", HTTPStatus.BAD_REQUEST

    # get file from request and save it to /uploads
    file_name = photos.save(request.files["image"])

    data = read_stats(file_name)

    # delete the file
    os.remove(os.path.join(app.config["UPLOADED_PHOTOS_DEST"], file_name))

    return jsonify(data)

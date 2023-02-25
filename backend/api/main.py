from flask import Flask, request, jsonify, Response, make_response
from flask_mongoengine import MongoEngine
import os
from api.models import *
from http import HTTPStatus
import json
from flask_cors import CORS, cross_origin

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
        user = User.objects(email = email)[0]
    except:
        return "There is no account associated with this email.", HTTPStatus.BAD_REQUEST

    if not user.check_password(password):
        return "Wrong password.", HTTPStatus.BAD_REQUEST

    token = User.issue_token(str(user.pk))
    res = jsonify(user_id = str(user.pk), token = str(token))
    res.set_cookie(
        key = "token",
        value = token,
        max_age = 400 * 24 * 3600,
        httponly = False
    )
    return res


def _login_reissue(token: str):
    new, user_id = User.reissue_token(token)
    if new is None:
        return "Token invalid or account was modified and must relogin.", HTTPStatus.BAD_REQUEST
    res = jsonify(user_id = user_id, token = token)
    res.set_cookie(
        key = "token",
        value = new,
        max_age = 400 * 24 * 3600,
        httponly = False
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
    email: str = request.args.get("email", type = str)
    password: str = request.args.get("password", type = str)
    staff: bool = request.args.get("staff", type = json.loads)
    name: str = request.args.get("name", type = str)

    if email is None or password is None or name is None:
        return "Bad request.", HTTPStatus.BAD_REQUEST

    perms = authenticate()
    if staff is True and not perms.is_staff():
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED

    email = email.lower()
    if User.objects(email = email).count() > 0:
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

    start_time: int = request.args.get("start_time", type = int)
    end_time: int = request.args.get("end_time", type = int)
    game_id: str = request.args.get("game", type = str)
    restricted: bool = request.args.get("restricted", type = json.loads)
    tournament: bool = request.args.get("tournament", type = json.loads)

    if start_time is None or end_time is None or game_id is None:
        return "Bad Request.", HTTPStatus.BAD_REQUEST
    
    if restricted is None:
        restricted = False

    if tournament is None:
        tournament = False
    
    game = Game.objects(pk = game_id)[0]

    match_filter = lambda match: (start_time <= match.timestamp and match.timestamp <= end_time)

    if restricted:
        _func = match_filter
        def _new(match: Match):
            if not _func(match): return False
            for player in match.team_a_players + match.team_b_players:
                if player is None:
                    return False
            return True
        match_filter = _new

    player_filter = lambda player: True

    data = Match.analyze(player_filter, match_filter, game, tournament = tournament)
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
    game: str = request.args.get("game", type = str)

    """
    perms = authenticate()
    if not perms.is_staff() and id != perms.user_id:
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED
    """

    user = User.objects(pk = id)[0]

    user.selected_games.append(mongo.ObjectId(game))

    user.save()

    return "", HTTPStatus.CREATED


@app.delete("/users/<string:id>/selected_games")
@cross_origin()
def games_delete(id):
    game: str = request.args.get("game", type = str)

    """
    perms = authenticate()
    if not perms.is_staff() and id != perms.user_id:
        return "Unauthorized.", HTTPStatus.UNAUTHORIZED
    """

    user = User.objects(pk = id)[0]

    user.selected_games.remove(mongo.ObjectId(game))

    user.save()

    return "", HTTPStatus.CREATED

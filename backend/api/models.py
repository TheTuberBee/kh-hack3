import mongoengine as mongo
import jwt
import time
import os
import bcrypt
from api.elo import *

# generate one with secrets.token_urlsafe(nbytes = 16)
jwt_secret: str = os.environ["JWT_SECRET"]

class User(mongo.Document):
    email = mongo.StringField()
    password = mongo.StringField()
    last_modified = mongo.IntField()
    staff = mongo.BooleanField(default = False)
    name = mongo.StringField()
    riot_id = mongo.StringField()
    selected_games = mongo.ListField(field = mongo.StringField())

    class Permissions:
        def __init__(self, claims: dict = {}):
            try:
                self.user_id: str = claims["sub"]
            except:
                self.user_id = None
            try:
                self.scopes: list[str] = claims["scopes"]
            except:
                self.scopes = []

        def is_authenticated(self):
            return self.user_id is not None

        def is_staff(self):
            return "staff" in self.scopes

        def get_user(self):
            user: User = User.objects(pk = self.user_id)[0]
            return user

    ISSUER = "https://kh-hack3-api.vercel.app"

    @classmethod
    def issue_token(cls, user_id: str, expiration: int = 600):
        user: User = cls.objects(pk = user_id)[0]
        scopes: list[str] = []

        if user.staff:
            scopes.append("staff")

        claims = {
            "iss": cls.ISSUER, # issuer
            "sub": user_id, # subject (user primary key)
            "iat": int(time.time()), # time of issuance, unix timestamp
            "exp": int(time.time()) + expiration, # expiration time, in seconds
            "scopes": scopes
        }
        token: str = jwt.encode(claims, jwt_secret, algorithm = "HS256")
        return token

    @classmethod
    def authenticate_token(cls, token: str):
        try:
            # throws if invalid or expired
            claims: dict = jwt.decode(
                token, 
                jwt_secret, 
                algorithms = [ "HS256" ],
                issuer = cls.ISSUER,
                options = { "require": ["iss", "sub", "iat", "exp", "scopes"] }
            )
            return cls.Permissions(claims)
        except:
            return cls.Permissions()

    @classmethod
    def reissue_token(cls, token: str, expiration: int = 600):
        try:
            # throws if invalid, but not when expired
            claims: dict = jwt.decode(
                token, 
                jwt_secret, 
                algorithms = [ "HS256" ],
                issuer = cls.ISSUER,
                options = { 
                    "require": ["iss", "sub", "iat", "exp", "scopes"],
                    "verify_exp": False,
                }
            )
            user_id: int = claims["sub"]
            user: User = cls.objects(pk = user_id)[0]

            # denying request if the account was modified since the issuance
            issuance: int = claims["iat"]
            if user.last_modified >= issuance:
                return None, None

            # case: the account exists and was not modified so the user can continue their session
            return cls.issue_token(user_id, expiration), user_id
        except:
            # case: previous token was invalid or the account does not exist
            return None, None
        
    def set_password(self, plain: str):
        try:
            self.password = bcrypt.hashpw(plain.encode("utf8"), bcrypt.gensalt()).decode("utf8")
        except:
            # it seems like on some platforms hashpw returns not bytes but str
            self.password = bcrypt.hashpw(plain.encode("utf8"), bcrypt.gensalt())

    def check_password(self, plain: str):
        try:
            return bcrypt.checkpw(plain.encode("utf8"), self.password.encode("utf8"))
        except:
            return False
        
    def __hash__(self):
        return hash(str(self.pk))


class Game(mongo.Document):
    name = mongo.StringField()
    factor_names = mongo.ListField(field = mongo.StringField())
    factor_values = mongo.ListField(field = mongo.FloatField())
    team_size = mongo.IntField()


class Match(mongo.Document):
    timestamp = mongo.IntField()
    team_a_players = mongo.ListField(mongo.ReferenceField(document_type = User))
    team_b_players = mongo.ListField(mongo.ReferenceField(document_type = User))
    result = mongo.FloatField(0.0, 1.0) # wonrate of team_a
    game = mongo.ReferenceField(document_type = Game)
    team_a_stats = mongo.ListField(mongo.ListField(mongo.FloatField()))
    team_b_stats = mongo.ListField(mongo.ListField(mongo.FloatField()))
    additional_info = mongo.StringField()

    @classmethod
    def add_match(
        cls, 
        timestamp: int,
        team_a_players: list[User], 
        team_b_players: list[User], 
        result: float, 
        game: Game, 
        team_a_stats: list[list[float]],
        team_b_stats: list[list[float]],
        additional_info: str = None
    ):
        cls(
            team_a_players = team_a_players,
            team_b_players = team_b_players,
            result = result,
            game = game,
            team_a_stats = team_a_stats,
            team_b_stats = team_b_stats,
            additional_info = additional_info,
            timestamp = timestamp
        ).save()


    @classmethod
    def analyze(cls, player_filter, match_filter, game: Game):

        scoreboard: dict[User, dict] = {}
        for user in User.objects:
            if player_filter(user):
                scoreboard[user] = {
                    "id": str(user.pk),
                    "name": user.name,
                    "rating": 400,
                    "factors": []
                }
                for factor in game.factor_values:
                    scoreboard[user]["factors"].append(0)

        for match in cls.objects:
            match: Match
            if match_filter(match) and match.game == game:

                team_a_elo = []
                for player in match.team_a_players:
                    if player is not None:
                        team_a_elo.append(scoreboard[player]["rating"])
                    else:
                        team_a_elo.append(None)

                team_b_elo = []
                for player in match.team_b_players:
                    if player is not None:
                        team_b_elo.append(scoreboard[player]["rating"])
                    else:
                        team_b_elo.append(None)

                delta_a, delta_b = elo_change(
                    team_a_elo = team_a_elo,
                    team_b_elo = team_b_elo,
                    team_a_score = match.result,
                    team_b_score = 1 - match.result,
                    team_a_stats = match.team_a_stats,
                    team_b_stats = match.team_b_stats,
                    team_size = game.team_size,
                    game = game.factor_values
                )

                for i in range(match.game.team_size):
                    #print(match.team_a_players[i].name, scoreboard[match.team_a_players[i]])
                    #print(match.team_b_players[i].name, scoreboard[match.team_b_players[i]])
                    if match.team_a_players[i] is not None:
                        player_data = scoreboard[match.team_a_players[i]]
                        player_data["rating"] += delta_a[i]
                        for factor in range(len(game.factor_values)):
                            player_data["factors"][factor] += match.team_a_stats[i][factor]

                    if match.team_b_players[i] is not None:
                        player_data = scoreboard[match.team_b_players[i]]
                        player_data["rating"] += delta_b[i]
                        for factor in range(len(game.factor_values)):
                            player_data["factors"][factor] += match.team_b_stats[i][factor]

        players = [scoreboard[key] for key in scoreboard]
        return {
            "game": {
                "name": game.name,
                "factor_names": list(game.factor_names)
            },
            "players": sorted(players, key = lambda player: player["rating"], reverse = True)
        }




def test_leaderboard():

    for user in User.objects:
        if len(user.name) > 20:
            user.delete()

    for game in Game.objects:
        if len(game.name) > 20:
            game.delete()

    for match in Match.objects:
        match.delete()

    import secrets
    teams = []
    for t in range(2):
        team = []
        for i in range(2):
            user = User(
                email = secrets.token_hex(16),
                password = secrets.token_hex(16),
                name = secrets.token_hex(16),
            )
            user.save()
            team.append(user)
        teams.append(team)

    game = Game(
        name = secrets.token_hex(16),
        factor_names = ["asd"],
        factor_values = [1],
        team_size = 2
    ).save()

    for i in range(3):
        Match.add_match(
            int(time.time()),
            teams[0],
            teams[1],
            1.0,
            game,
            [[1],[4]],
            [[1],[1]],
        )

    def player_filter(user):
        return True
    
    def match_filter(match):
        return True

    scoreboard = Match.analyze(player_filter, match_filter, game)
    print(scoreboard)


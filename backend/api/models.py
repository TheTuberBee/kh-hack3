import mongoengine as mongo
import jwt
import time
import os
import bcrypt

# generate one with secrets.token_urlsafe(nbytes = 16)
jwt_secret: str = os.environ["JWT_SECRET"]

class User(mongo.Document):
    email = mongo.StringField()
    password = mongo.StringField()
    last_modified = mongo.IntField()
    staff = mongo.BooleanField(default = False)
    name = mongo.StringField()
    selectedGames = mongo.ListField(mongo.StringField())

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

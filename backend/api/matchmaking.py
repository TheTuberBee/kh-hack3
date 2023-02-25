from api.team_structures import *
from api.models import *


class Matchmaking:
    def __init__(self, user_id, position, player_elo, rank, region, language):
        self.user_id = user_id
        self.position = position
        self.player_elo = player_elo
        self.rank = rank
        self.region = region
        self.language = language

    def join_single_queue(self, preferred_position):
        # get users in queue
        users = SinglePool.objects(language = self.language, region = self.region, rank = self.rank, position = preferred_position)
        
        # sort users by elo
        users = sorted(users, key = lambda user: user.elo)
        # find the best match
        for user in users:
            print(user.elo)
            if abs(user.elo - self.player_elo) <= 100:
                print("match found")

                found_user = user.user_id

                # remove user from queue
                user.delete()
                return {"in_queue": False, "found_user": found_user}
            
        # write user to queue
        SinglePool(user_id = self.user_id, position = self.position, rank = self.rank, elo = self.player_elo, region = self.region, language = self.language).save()
        return {"in_queue": True}


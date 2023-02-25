from api.team_structures import *
from api.models import *


class Matchmaking:
    def __init__(self, position, player_elo, rank, region, language):
        self.position = position
        self.player_elo = player_elo
        self.rank = rank
        self.region = region
        self.language = language

    def join_single_queue(self, preferred_position):
        # get all users in queue
        users = SinglePool.objects(position = preferred_position, rank = self.rank, region = self.region, language = self.language)
        # sort users by elo
        users = sorted(users, key = lambda user: user.elo)
        # find the best match
        for user in users:
            if abs(user.elo - self.player_elo) <= 100:
                # remove user from queue
                user.delete()
                return user
            
        # write user to queue
        SinglePool(user_id = self.user_id, position = self.position, rank = self.rank, elo = self.player_elo, region = self.region, language = self.language).save()
        return None


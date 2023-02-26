import requests
try:
    import api.models as models
except:
    import models
import os
import time
try:
    import api.gpt3 as gpt3
except:
    import gpt3
import random
import pickle

api_domain = "https://europe.api.riotgames.com"
try:
    api_key = os.environ["RIOT_DEV_API_KEY"]
except:
    api_key = input("Riot Dev API Key: ")
headers = {"X-Riot-Token": api_key}

def callapi(url):
    response = requests.get(url, headers=headers)
    time.sleep(1)
    if response.status_code == 200 or response.status_code == 201:
        return response.json()
    elif response.status_code == 429:
        print("API call to " + url + " failed with status code 429. Retrying in 5 seconds...")
        time.sleep(5)
        return callapi(url)
    else:
        print("API call to " + url + " failed with status code " + str(response.status_code) + ".")
        return None

class AccountDto:
    def __init__(self, dto):
        if dto is None:
            return None
        self.puuid = dto["puuid"]
        self.gameName = dto["gameName"]
        self.tagLine = dto["tagLine"]

    def byPUUID(puuid):
        # /riot/account/v1/accounts/by-puuid/{puuid}
        url = api_domain + "/riot/account/v1/accounts/by-puuid/" + puuid
        return AccountDto(callapi(url))

    def byRiotID(gameName, tagLine):
        # /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
        url = api_domain + "/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine
        return AccountDto(callapi(url))

    def __str__(self):
        return "puuid: " + self.puuid + ", gameName: " + self.gameName + ", tagLine: " + self.tagLine

def get_match_ids_by_puuid(puuid, start, end):
    # /lol/match/v5/matches/by-puuid/{puuid}/ids
    url = api_domain + "/lol/match/v5/matches/by-puuid/" + puuid + "/ids" #?start=" + str(start) + "&end=" + str(end)
    return callapi(url)

def get_match_by_id(match_id):
    # /lol/match/v5/matches/{matchId}
    url = api_domain + "/lol/match/v5/matches/" + match_id
    return callapi(url)

def get_match_timeline_by_id(match_id):
    # /lol/match/v5/matches/{matchId}/timeline
    url = api_domain + "/lol/match/v5/matches/" + match_id + "/timeline"
    return callapi(url)

def get_demo_user_opinion(riot_gamename, riot_tagline):
    user = AccountDto.byRiotID(riot_gamename, riot_tagline)
    match_ids = get_match_ids_by_puuid(user.puuid, 0, 10)
    match = get_match_by_id(match_ids[0])
    for participant in match["info"]["participants"]:
        if participant["puuid"] == user.puuid:
            return gpt3.get_opinion(participant["stats"])

def user_lookup(riot_id, stats):
    found = models.User.objects(riot_id = riot_id)
    if len(found) == 0:
        userdata = AccountDto.byPUUID(riot_id)
        user = models.User()
        user.riot_id = riot_id
        user.riot_name = userdata.gameName
        user.riot_tagline = userdata.tagLine
        user.name = userdata.gameName
        user.tags = gpt3.get_opinion(stats)[1]
        user.save()
        return user
    # found[0].tags = gpt3.combine_tags(gpt3.get_opinion(stats)[1], found[0].tags)
    # found[0].save()
    return found[0]

# user = AccountDto.byPUUID("6byl4iaQyoNR5EwD73uYZ_e8pHtuAF_cJvHq6WvpqAZIz83CxhZ55QPlF880dY7DbKL5aw4D4kRTMw")
# print(user.gameName + "#" + user.tagLine)

# match_ids = get_match_ids_by_puuid(user.puuid, 0, 10)
# print(match_ids)

# match = get_match_by_id(match_ids[0])
# print(match)
def add_simplified_match(match):
    users_a = []
    stats_a = []
    users_b = []
    stats_b = []

    for participant in match["info"]["participants"]:
        stats = [
            participant["assists"],
            participant["baronKills"],
            participant["deaths"],
            participant["dragonKills"],
            participant["goldEarned"],
            participant["goldSpent"],
            participant["inhibitorKills"],
            participant["itemsPurchased"],
            participant["kills"],
            participant["totalHealsOnTeammates"],
            participant["turretKills"]
        ]
        if participant["teamId"] == 100:
            users_a.append(user_lookup(participant["puuid"], stats))
            stats_a.append(stats)
        else:
            users_b.append(user_lookup(participant["puuid"], stats))
            stats_b.append(stats)

    for team in match["info"]["teams"]:
        if team["win"]:
            winner_team = team["teamId"]
            break

    # calculate total gold earned for each team
    total_gold_a = 0
    total_gold_b = 0
    for participant in match["info"]["participants"]:
        if participant["teamId"] == 100:
            total_gold_a += participant["goldEarned"]
        else:
            total_gold_b += participant["goldEarned"]
    
    total_gold = total_gold_a + total_gold_b
    result = total_gold_a / total_gold

    models.Match.add_match(
        int(time.time()) - int(random.random() * 60 * 24 * 3600),
        users_a,
        users_b,
        result,
        models.Game.objects(pk = "63fa20423cab53f5ff515119")[0],
        stats_a,
        stats_b
    )


# match_ids = get_match_ids_by_puuid("6byl4iaQyoNR5EwD73uYZ_e8pHtuAF_cJvHq6WvpqAZIz83CxhZ55QPlF880dY7DbKL5aw4D4kRTMw", 0, 10)
# match = get_match_by_id(match_ids[0])
# random_matches = []

# # if random_matches.pickle exists, load it
# try:
#     with open("random_matches.pickle", "rb") as f:
#         random_matches = pickle.load(f)
# except:    
#     # look up each user's match history
#     for i, participant in enumerate(match["info"]["participants"]):
#         try:
#             matches = get_match_ids_by_puuid(participant["puuid"], 0, 10)
#             random_matches += [get_match_by_id(match_id) for match_id in matches]
#             random_matches += [get_match_by_id(match_id) for match_id in get_match_ids_by_puuid(get_match_by_id(matches[0])["info"]["participants"][0]["puuid"], 0, 10)]
#         except Exception as e:
#             print("hi meghaltam lol", e) # érted mert LoL :D
#         print(i, "/", len(match["info"]["participants"]))
    
#     # save random matches to a pickle file
#     with open("random_matches.pickle", "wb") as f:
#         pickle.dump(random_matches, f)


# for match in random_matches:
#     add_simplified_match(match)


user = AccountDto.byPUUID("6byl4iaQyoNR5EwD73uYZ_e8pHtuAF_cJvHq6WvpqAZIz83CxhZ55QPlF880dY7DbKL5aw4D4kRTMw")
print(user.gameName + "#" + user.tagLine)

match_ids = get_match_ids_by_puuid(user.puuid, 0, 10)
print(match_ids)

match = get_match_by_id(match_ids[0])
timeline = get_match_timeline_by_id(match_ids[0])

participant = [participant for participant in match["info"]["participants"] if participant.puuid == user.puuid][0]

get_opinion_timeline(participant, timeline)
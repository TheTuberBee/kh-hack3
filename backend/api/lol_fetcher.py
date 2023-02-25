import requests
import models

api_domain = "https://europe.api.riotgames.com"
api_key = "RGAPI-b807583d-eb2f-45b5-b29e-5ff648a1251b" # include in header
headers = {"X-Riot-Token": api_key}

class AccountDto:
    def __init__(self, dto):
        self.puuid = dto["puuid"]
        self.gameName = dto["gameName"]
        self.tagLine = dto["tagLine"]

    def byPUUID(puuid):
        # /riot/account/v1/accounts/by-puuid/{puuid}
        url = api_domain + "/riot/account/v1/accounts/by-puuid/" + puuid
        response = requests.get(url, headers=headers)
        return AccountDto(response.json())

    def byRiotID(gameName, tagLine):
        # /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
        url = api_domain + "/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine
        response = requests.get(url, headers=headers)
        return AccountDto(response.json())

    def __str__(self):
        return "puuid: " + self.puuid + ", gameName: " + self.gameName + ", tagLine: " + self.tagLine

def get_match_ids_by_puuid(puuid, start, end):
    # /lol/match/v5/matches/by-puuid/{puuid}/ids
    url = api_domain + "/lol/match/v5/matches/by-puuid/" + puuid + "/ids" #?start=" + str(start) + "&end=" + str(end)
    response = requests.get(url, headers=headers)
    return response.json()

def get_match_by_id(match_id):
    # /lol/match/v5/matches/{matchId}
    url = api_domain + "/lol/match/v5/matches/" + match_id
    response = requests.get(url, headers=headers)
    return response.json()

def get_match_timeline_by_id(match_id):
    # /lol/match/v5/matches/{matchId}/timeline
    url = api_domain + "/lol/match/v5/matches/" + match_id + "/timeline"
    response = requests.get(url, headers=headers)
    return response.json()

def user_lookup(riot_id):
    found = models.User.objects(riot_id = riot_id)
    if len(found) == 0:
        return None
    return found[0]

user = AccountDto.byPUUID("6byl4iaQyoNR5EwD73uYZ_e8pHtuAF_cJvHq6WvpqAZIz83CxhZ55QPlF880dY7DbKL5aw4D4kRTMw")
print(user.gameName + "#" + user.tagLine)

match_ids = get_match_ids_by_puuid(user.puuid, 0, 10)
print(match_ids)

match = get_match_by_id(match_ids[0])
print(match)

users_a = []
users_b = []

for participant in match["info"]["participants"]:
    if participant["teamId"] == 100:
        users_a.append(participant)
    else:
        users_b.append(participant)
        
for team in match["info"]["teams"]:
    if team["win"]:
        winner_team = team["teamId"]
        break



models.Match.add_match(
    match["info"]["gameEndTimestamp"],

)

import math

def _avg(values: list[int]):
    n = 0
    sum = 0
    for value in values:
        if value is not None:
            n += 1
            sum += value
    try:
        return sum / n
    except ZeroDivisionError:
        return None
    
def _remove_unknowns(values1: list[int], values2: list[int]):
    n = 0
    sum = 0
    
    for value in values1 + values2:
        if value is not None:
            n += 1
            sum += value

    if n == 0:
        return [None], [None]
    
    avg = sum / n

    new1 = []
    for value in values1:
        if value is None:
            new1.append(avg)
        else:
            new1.append(value)

    new2 = []
    for value in values2:
        if value is None:
            new2.append(avg)
        else:
            new2.append(value)

    return new1, new2

# Predicts the chance of Team A winning
def _prediction(team_a: list[int], team_b: list[int]) -> float:
    a, b = _remove_unknowns(team_a, team_b)
    print(a, b)
    avg_a = _avg(a)
    avg_b = _avg(b)
    if avg_a is None or avg_b is None:
        return 0.5
    return 1 / (1 + (10.0 ** ((_avg(team_b) - _avg(team_a)) / 400)))

# Calculates the outcome
def _result(team: int, opponent: int) -> float:
    return team / (team + opponent)

# Calculates the average ΔScore for one team
def _delta_team_score(result: float, prediction: float, team_size: int) -> float:
    return 64 * team_size * (result - prediction)

def _player_value(stats: list[float], game: list[float]) -> float:
    sum = 0
    for i in range(len(game)):
        sum += stats[i] * game[i]
    return sum

def _contributions(team_stats: list[list[float]], game: list[float]) -> list[float]:
    values = [_player_value(stats, game) for stats in team_stats]
    normalized = [value / sum(values) for value in values]
    return normalized

def _responsibility(team_stats: list[list[float]], game: list[float]) -> list[float]:
    values = [1 / _player_value(stats, game) for stats in team_stats]
    normalized = [value / sum(values) for value in values]
    return normalized

def _delta_scores(delta_team_score: float, contributions: list[float]) -> list[int]:
    return [round(delta_team_score * c) for c in contributions]


def elo_change(
    team_a_elo: list[int], 
    team_b_elo: list[int], 
    team_a_score: int,
    team_b_score: int,
    team_a_stats: list[list[float]],
    team_b_stats: list[list[float]],
    team_size: int,
    game: list[float],
) -> tuple[list[int], list[int]]:
    
    prediction_a = _prediction(team_a_elo, team_b_elo)
    print(team_a_elo)
    result_a = _result(team_a_score, team_b_score)
    delta_team_score_a = _delta_team_score(result_a, prediction_a, team_size)

    dist_a = _contributions(team_a_stats, game) if delta_team_score_a > 0 else _responsibility(team_a_stats, game)
    dist_b = _contributions(team_b_stats, game) if delta_team_score_a < 0 else _responsibility(team_b_stats, game)

    delta_a = _delta_scores(delta_team_score_a, dist_a)
    delta_b = _delta_scores(-delta_team_score_a, dist_b)

    return delta_a, delta_b


if __name__ == "__main__":
    delta_a, delta_b = elo_change(
        team_a_elo = [1000, 1200, 800],
        team_b_elo = [1200, 1200, 600],
        team_a_score = 16,
        team_b_score = 12,
        team_a_stats = [[1, 3, 4], [2, 2, 5], [0, 1, 2]],
        team_b_stats = [[2, 2, 1], [3, 4, 2], [1, 1, 2]],
        team_size = 2,
        game = [2, -1, 1]
    )

    print(delta_a, delta_b)

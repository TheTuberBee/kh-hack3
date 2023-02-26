import axios from "../config/axios";

export const getLeaderBoardData = async (
  gameId: number,
  startTime: number,
  endTime: number,
  isTournament: boolean
) => {
  try {
    const response = await axios.get("/leaderboard", {
      params: {
        game: gameId,
        start_time: startTime,
        end_time: endTime,
        tournament: isTournament,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const getAIResponse = async (gameId: number, userId: string) => {
  try {
    const response = await axios.get("/ai", {
      timeout: 30000,
      params: {
        gameId: gameId,
        userId: userId,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const getPossibleFriends = async () => {
  try {
    const ui = localStorage.getItem("uid");
    if (ui) {
      const response = await axios.get("/teammate_finder", {
        params: {
          user_id: ui,
        },
      });

      return response;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};

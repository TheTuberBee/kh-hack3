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

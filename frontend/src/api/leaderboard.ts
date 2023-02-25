import axios from "../config/axios";

export const getLeaderBoardData = async (
  gameId: number,
  startTime: number,
  endTime: number
) => {
  try {
    const response = await axios.get("/leaderboard", {
      params: { gameId, startTime, endTime },
    });

    return response;
  } catch (error) {
    return error;
  }
};

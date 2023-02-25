import axios from "../config/axios";

export const getLeaderBoardData = async (
  gameName: string,
  startTime: number,
  endTime: number
) => {
  try {
    const response = await axios.get("/leaderboard", {
      params: { gameName, startTime, endTime },
    });

    return response;
  } catch (error) {
    return error;
  }
};

import axios from "../config/axios";

export const addGame = async (game: number) => {
  try {
    const uid = localStorage.getItem("uid");
    const response = await axios.post("/games", null, {
      params: { uid, game },
    });

    return response;
  } catch (error) {
    return error;
  }
};

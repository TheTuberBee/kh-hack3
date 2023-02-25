import axios from "../config/axios";

export const getAllGames = async () => {
  try {
    const response = await axios.get("/games");
    return response;
  } catch (error) {
    return error;
  }
};

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

export const removeGame = async (game: number) => {
  try {
    const uid = localStorage.getItem("uid");
    const response = await axios.delete("/games", {
      params: { uid, game },
    });

    return response;
  } catch (error) {
    return error;
  }
};

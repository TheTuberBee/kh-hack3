import axios from "../config/axios";

export const getAllGames = async () => {
  try {
    const response = await axios.get("/games");
    return response;
  } catch (error) {
    return error;
  }
};

export const addGame = async (game: string) => {
  try {
    const uid = localStorage.getItem("uid");
    const response = await axios.post(
      "/users/" + uid + "/selected_games",
      null,
      {
        params: { game: `${game}` },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const removeGame = async (game: string) => {
  try {
    const uid = localStorage.getItem("uid");
    const response = await axios.delete("/users/" + uid + "/selected_games", {
      params: { game: `${game}` },
    });

    return response;
  } catch (error) {
    return error;
  }
};

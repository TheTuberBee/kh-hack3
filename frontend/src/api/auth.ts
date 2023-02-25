import axios from "../config/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.get("/api/login", {
      params: { email, password },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post("/api/register", {
      params: { name, email, password },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

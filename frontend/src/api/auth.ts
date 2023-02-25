import axios from "../config/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.get("/login", {
      params: { email, password },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  staff?: boolean
) => {
  try {
    if (staff) {
      const response = await axios.post("/user", null, {
        params: { email, password, staff, name },
      });
      return response;
    } else {
      const response = await axios.post("/user", null, {
        params: { email, password, name },
      });
      return response;
    }
  } catch (error) {
    return error;
  }
};

export const getCurrentUser = async (uid: string) => {
  try {
    const response = await axios.get("/user/" + uid, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response;
  } catch (error) {
    return error;
  }
};

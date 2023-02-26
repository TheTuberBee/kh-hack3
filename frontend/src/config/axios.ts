import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "https://kh-hack3-api.vercel.app";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
}

export default axios;

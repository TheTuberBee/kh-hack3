import axios from "axios";

axios.defaults.baseURL = "https://kh-hack3-api-git-master-kh-hack3.vercel.app";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
}

export default axios;

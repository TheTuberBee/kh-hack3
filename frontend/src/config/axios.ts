import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://kh-hack3-pb0qz3ela-thetuberbee.vercel.app/";

export default axios;

import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default axios;

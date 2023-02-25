import axios from "axios";
import process from "process";

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default axios;

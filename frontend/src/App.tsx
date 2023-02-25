import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { setLoggedIn, setToken } from "./redux/actions/authAction";
import Profile from "./pages/Profile";
import LeaderBoard from "./pages/LeaderBoard";
import TeamFinder from "./pages/TeamFinder";
import "./index.css";

function getCookie(cname: string) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state: any = useSelector((state) => state);

  useEffect(() => {
    const token = getCookie("token");

    if (token !== "") {
      dispatch(setToken(token));
      dispatch(setLoggedIn(true));
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, [dispatch, location.pathname, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {state.loggedIn && <Route path="/profile" element={<Profile />} />}
        {state.loggedIn && (
          <Route path="/leaderboard" element={<LeaderBoard />} />
        )}
        {state.loggedIn && (
          <Route path="/teamfinder" element={<TeamFinder />} />
        )}
        {state.loggedIn && <Route path="/" element={<Home />} />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

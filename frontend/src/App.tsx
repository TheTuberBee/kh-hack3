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
import Profile from "./pages/Profile";
import LeaderBoard from "./pages/LeaderBoard";
import TeamFinder from "./pages/TeamFinder";
import { setCurrentUser, setLoggedIn } from "./redux/actions/authAction";
import "./index.css";
import { getCurrentUser } from "./api/auth";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state: any = useSelector((state) => state);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const getCurrentUser2 = async () => {
      const user = await getCurrentUser(uid as string);
      console.log(user);
      dispatch(setCurrentUser(user));
    };

    if (!state.currentUser && uid) {
      getCurrentUser2();
    }
  }, [dispatch, state.currentUser]);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      dispatch(setLoggedIn(true));
    } else if (
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      dispatch(setLoggedIn(false));
      navigate("/login");
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
        <Route
          path="*"
          element={<Navigate to={state.loggedIn ? "/" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;

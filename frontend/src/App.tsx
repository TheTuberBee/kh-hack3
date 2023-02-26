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
import AIPage from "./pages/AIPage";
import ImageRecognizer from "./pages/ImageRecognizer";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state: any = useSelector((state) => state);

  const element = document.querySelector(".MuiPickerStaticWrapper-content");
  const child = element?.firstChild;
  const secondChild = child?.firstChild;
  const newDiv = document.createElement("div");
  secondChild?.replaceWith(newDiv);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    const getCurrentUser2 = async () => {
      const user: any = await getCurrentUser(uid as string, token as string);
      if (user.data && user.data.name && user.data.name.length > 0) {
        localStorage.setItem("name", user.data.name);
      }
      if (user.data && user.data.selected_games) {
        localStorage.setItem(
          "selected_games",
          JSON.stringify(user.data.selected_games)
        );
      }
      dispatch(setCurrentUser(user.data));
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
        {state.loggedIn && (
          <Route path="/imagerecognizer" element={<ImageRecognizer />} />
        )}
        {state.loggedIn && <Route path="/aipage" element={<AIPage />} />}
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

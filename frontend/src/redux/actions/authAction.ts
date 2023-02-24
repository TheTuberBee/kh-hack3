import {
  SET_TOKEN,
  SET_CURRENT_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from "../actionTypes/actionTypes";

const setToken = (token: string) => {
  return {
    type: SET_TOKEN,
    payload: token,
  };
};

const setCurrentUser = (currentUser: any) => {
  return {
    type: SET_CURRENT_USER,
    payload: currentUser,
  };
};

const setLoggedIn = (loggedIn: boolean) => {
  return {
    type: SET_LOGGED_IN,
    payload: loggedIn,
  };
};

const setLoggedOut = () => {
  return {
    type: SET_LOGGED_OUT,
  };
};

export { setToken, setCurrentUser, setLoggedIn, setLoggedOut };

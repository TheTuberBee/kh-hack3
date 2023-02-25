import {
  SET_CURRENT_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from "../actionTypes/actionTypes";

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

export { setCurrentUser, setLoggedIn, setLoggedOut };

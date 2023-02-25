import {
  SET_CURRENT_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from "../actionTypes/actionTypes";

const initialState = {
  currentUser: null,
  loggedIn: false,
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case SET_LOGGED_IN:
      return {
        ...state,
        loggedIn: action.payload,
      };

    case SET_LOGGED_OUT:
      return {
        ...state,
        currentUser: null,
        loggedIn: false,
      };

    default:
      return state;
  }
};

export default authReducer;

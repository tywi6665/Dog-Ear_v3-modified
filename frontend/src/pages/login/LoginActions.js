import axios from "axios";
import { setAxiosAuthToken } from "../../utils";
import {
  setToken,
  setCurrentUser,
  unsetCurrentUser,
} from "../../reducers/loginSlice";

export const login = (
  userData,
  redirectTo,
  navigate,
  dispatch,
  displayMessage
  // callback
) => {
  axios
    .post("api/v1/token/login/", userData) // post to login REST API
    .then((response) => {
      const { auth_token } = response.data; // get auth_token
      setAxiosAuthToken(auth_token); // set token in axios header
      set_Token(auth_token, dispatch); // set token in reducer
      getCurrentUser(redirectTo, navigate, dispatch, displayMessage); // dispatch request to get user details
    })
    .catch((error) => {
      unset_CurrentUser(dispatch); // reset the state
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const getCurrentUser = (
  redirectTo,
  navigate,
  dispatch,
  displayMessage
) => {
  axios
    .get("api/v1/users/me/")
    .then((response) => {
      const user = {
        username: response.data.username,
        email: response.data.email,
      };
      set_CurrentUser(user, redirectTo, navigate, dispatch);
    })
    .catch((error) => {
      unset_CurrentUser(dispatch);
      if (error.response) {
        if (
          Object.values(error.response.data)[0] === "User inactive or deleted."
        ) {
          navigate("/resend_activation");
        }
      } else {
        displayMessage(Object.values(error.response.data)[0], "error");
      }
    });
};

export const set_CurrentUser = (user, redirectTo, navigate, dispatch) => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch(setCurrentUser(user));

  if (redirectTo !== "") {
    navigate(redirectTo);
  }
};

export const set_Token = (token, dispatch) => {
  setAxiosAuthToken(token);
  localStorage.setItem("token", token);
  dispatch(setToken(token));
};

export const unset_CurrentUser = (dispatch) => {
  setAxiosAuthToken("");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(unsetCurrentUser());
};

export const logout = (navigate, dispatch, displayMessage) => {
  axios
    .post("/api/v1/token/logout/")
    .then((res) => {
      unset_CurrentUser(dispatch);
      navigate("/login");
      if (displayMessage) {
        displayMessage("Logout successful.", "success");
      }
    })
    .catch((error) => {
      unset_CurrentUser(dispatch);
      if (displayMessage) {
        displayMessage(Object.values(error.response.data)[0], "error");
      }
    });
};

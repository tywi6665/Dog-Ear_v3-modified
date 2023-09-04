import axios from "axios";
import { login } from "../login/LoginActions";
import {
  createUserSubmitted,
  createUserError,
  createUserSuccess,
} from "../../reducers/signupSlice";
import { add_Recipe } from "../catalog/CatalogActions";
import { v4 as uuidv4 } from "uuid";

export const signupNewUser = (
  userData,
  dispatch,
  navigate,
  displayMessage,
  setStatus
) => {
  dispatch(createUserSubmitted());
  axios
    .post("api/v1/users/", userData)
    .then((res) => {
      displayMessage(
        `Account for ${userData.username} created successfully. Welcome.`,
        "success"
      );
      setStatus("success");
      dispatch(createUserSuccess());
      // login(userData, "/catalog", navigate, dispatch, displayMessage);
    })
    .catch((error) => {
      setStatus("error");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Object.values(error.response.data).forEach((error) =>
          displayMessage(error, "error")
        );
        dispatch(createUserError(error.response.data));
      } else if (error.message) {
        // the error message is available,
        displayMessage(JSON.stringify(error.message), "error");
      } else {
        // strange error, just show it
        displayMessage(JSON.stringify(error), "error");
      }
    });
};

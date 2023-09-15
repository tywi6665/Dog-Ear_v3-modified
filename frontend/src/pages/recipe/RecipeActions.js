import axios from "axios";
import {
  getRecipe,
  patchRecipe,
  clearRecipe,
} from "../../reducers/recipeSlice";

export const get_Recipe = (id, dispatch, displayMessage) => {
  axios
    .get(`/api/v1/recipes/${id}/`)
    .then((res) => {
      dispatch(getRecipe(res.data));
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const patch_Recipe = (id, recipe, dispatch, displayMessage) => {
  axios
    .patch(`/api/v1/recipes/${id}/`, recipe)
    .then((res) => {
      dispatch(patchRecipe(res.data));
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const delete_Recipe = (id, navigate, displayMessage) => {
  axios
    .delete(`/api/v1/recipes/${id}/`)
    .then((res) => {
      displayMessage("Recipe Successfully Deleted", "success");
      navigate("/catalog");
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const clear_Recipe = (dispatch) => {
  dispatch(clearRecipe());
};

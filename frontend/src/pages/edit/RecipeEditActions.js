import axios from "axios";

export const update_Recipe = (id, recipe, navigate, displayMessage) => {
  axios
    .put(`/api/v1/recipes/${id}/`, recipe)
    .then((res) => {
      navigate(-1, { replace: true });
      displayMessage("Recipe Successfully Updated", "success");
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

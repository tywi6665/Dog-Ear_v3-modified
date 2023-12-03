import axios from "axios";
import {
  getRecipes,
  addRecipe,
  getSearchOptions,
  setSearchQuery,
  getDuplicates,
  setSortBy,
  // setRetrievedData,
} from "../../reducers/catalogSlice";

export const get_Recipes = (dispatch, sortBy, searchQuery, displayMessage) => {
  let url = "";
  if (sortBy === "-timestamp" || sortBy === "timestamp") {
    url = `/api/v1/recipes/?ordering=${sortBy}`;
  } else {
    url = `/api/v1/recipes/?ordering=${sortBy},-timestamp`;
  }
  axios
    .get(url)
    .then((res) => {
      dispatch(getRecipes(res.data));
      get_SearchOptions(res.data, dispatch);
      if (searchQuery) {
        set_SearchQuery(searchQuery, dispatch);
      }
      // dispatch(setRetrievedData(true));
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const add_Recipe = (recipe, dispatch, displayMessage) => {
  axios
    .post("/api/v1/recipes/", recipe)
    .then((res) => {
      dispatch(addRecipe(res.data));
      displayMessage("Recipe successfully added", "success");
    })
    .catch((error) => {
      displayMessage(Object.values(error.response.data)[0], "error"); // raise message error
    });
};

export const get_SearchOptions = (recipes, dispatch) => {
  dispatch(getSearchOptions(recipes));
};

export const set_SearchQuery = (query, dispatch) => {
  dispatch(setSearchQuery(query));
};

export const get_Duplicates = (query, dispatch) => {
  dispatch(getDuplicates(query));
};

export const set_SortBy = (query, dispatch) => {
  dispatch(setSortBy(query));
};

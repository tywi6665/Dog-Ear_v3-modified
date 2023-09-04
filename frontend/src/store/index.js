import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../reducers/loginSlice";
import catalogSlice from "../reducers/catalogSlice";
import signupSlice from "../reducers/signupSlice";
import recipeSlice from "../reducers/recipeSlice";
import scrapedRecipeSlice from "../reducers/scrapedRecipeSlice";

export default configureStore({
  reducer: {
    signup: signupSlice,
    login: loginSlice,
    catalog: catalogSlice,
    recipe: recipeSlice,
    scrapedRecipe: scrapedRecipeSlice,
  },
});

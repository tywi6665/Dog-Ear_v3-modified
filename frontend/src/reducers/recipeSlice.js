import { createSlice } from "@reduxjs/toolkit";
import { testJSON } from "../utils";

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    recipe: {},
  },
  reducers: {
    getRecipe: (state, action) => {
      action.payload.tags.sort();
      // let copy = { ...action.payload };
      // testJSON(copy.notes);
      // if (testJSON(copy.notes)) {
      //   copy.notes = JSON.parse(copy.notes);
      // }
      // console.log(copy);
      state.recipe = action.payload;
    },
    patchRecipe: (state, action) => {
      action.payload.tags.sort();
      state.recipe = action.payload;
    },
    clearRecipe: (state) => {
      state.recipe = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { getRecipe, patchRecipe, clearRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;

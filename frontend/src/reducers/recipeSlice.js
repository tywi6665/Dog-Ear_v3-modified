import { createSlice } from "@reduxjs/toolkit";

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    recipe: {},
  },
  reducers: {
    getRecipe: (state, action) => {
      action.payload.tags.sort();
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

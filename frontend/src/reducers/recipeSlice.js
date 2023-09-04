import { createSlice } from "@reduxjs/toolkit";

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    recipe: {},
  },
  reducers: {
    getRecipe: (state, action) => {
      state.recipe = action.payload;
    },
    patchRecipe: (state, action) => {
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

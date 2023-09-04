import { createSlice } from "@reduxjs/toolkit";

export const scrapedRecipeSlice = createSlice({
  name: "scrapedRecipe",
  initialState: {
    taskID: null,
    scrapingStatus: null,
    uniqueID: null,
    url: "",
    scrapedRecipe: {},
    hadError: false,
  },
  reducers: {
    setTaskID: (state, action) => {
      state.taskID = action.payload;
    },
    setScrapingStatus: (state, action) => {
      state.scrapingStatus = action.payload;
    },
    setUniqueID: (state, action) => {
      state.uniqueID = action.payload;
    },
    // scrapeRecipe: (state, action) => {
    //   state.recipe = action.payload;
    // },
    setScrapedRecipe: (state, action) => {
      state.scrapedRecipe = action.payload;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setHadError: (state, action) => {
      state.hadError = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTaskID,
  setScrapingStatus,
  setUniqueID,
  // scrapeRecipe,
  setScrapedRecipe,
  setUrl,
  setHadError,
} = scrapedRecipeSlice.actions;

export default scrapedRecipeSlice.reducer;

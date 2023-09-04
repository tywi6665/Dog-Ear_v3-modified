import { createSlice } from "@reduxjs/toolkit";
import Fuse from "fuse.js";

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    recipes: [],
    filteredRecipes: [],
    searchOptions: [],
    searchQuery: "",
    duplicates: [],
    sortBy: "-timestamp",
    hasRetrievedData: false,
  },
  reducers: {
    getRecipes: (state, action) => {
      state.recipes = action.payload;
      state.filteredRecipes = action.payload;
      state.hasRetrievedData = true;
    },
    addRecipe: (state, action) => {
      console.log(action.payload);
      state.recipes = [...state.recipes, action.payload];
    },
    getSearchOptions: (state, action) => {
      let recipes = action.payload;
      let arr = {
        tags: [],
        allOptions: [],
      };
      recipes.forEach((recipe) => {
        let tags = recipe.tags;
        let cleanedTitle = recipe.title.trim();
        tags.forEach((tag) => {
          if (tag.length) {
            let cleanedTag = tag.toLowerCase().trim();
            if (!arr.tags.includes(cleanedTag)) {
              arr.tags.push(cleanedTag);
            }
            if (!arr.allOptions.includes(cleanedTag)) {
              arr.allOptions.push(cleanedTag);
            }
          }
        });
        if (!arr.allOptions.includes(cleanedTitle)) {
          arr.allOptions.push(cleanedTitle);
        }
      });
      let options = arr.tags.map((option) => {
        if (option.length) {
          // const firstLetter = option[0].toUpperCase();
          option = option.split(" ").map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
          });
          return {
            title: option[0],
            key: option[0],
            value: option[0],
          };
        }
      });
      arr.tags = options;
      arr.allOptions.sort();
      state.searchOptions = arr;
    },
    setSearchQuery: (state, action) => {
      let query = action.payload;
      state.searchQuery = query;
      const options = {
        keys: ["title", "author", "tags"],
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 1,
        findAllMatches: true,
        ignoreLocation: true,
      };
      if (state.recipes !== null) {
        // const searchAllRegex = query && new RegExp(`${query}`, "gi");
        // const result = state.recipes.filter(
        //   (recipe) =>
        //     !searchAllRegex ||
        //     searchAllRegex.test(recipe.title) +
        //       searchAllRegex.test(recipe.author) +
        //       searchAllRegex.test(recipe.tags)
        // );
        let result;
        if (query.length) {
          const fuse = new Fuse(state.recipes, options);
          result = fuse.search(query);
          result = result.filter((el) => el.score <= 0.25).map((el) => el.item);
        } else {
          result = state.recipes;
        }
        state.filteredRecipes = result;
      }
    },
    getDuplicates: (state, action) => {
      let url = action.payload;
      const options = {
        keys: ["url"],
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        findAllMatches: true,
        ignoreLocation: true,
      };
      if (url.length & (state.recipes !== null)) {
        const fuse = new Fuse(state.recipes, options);
        let result = fuse.search(url);
        result = result.filter((el) => el.score <= 0.25).map((el) => el.item);
        state.duplicates = result;
      } else {
        state.duplicates = [];
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // setRetrievedData: (state, action) => {
    //   state.retrievedData = action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const {
  getRecipes,
  addRecipe,
  getSearchOptions,
  setSearchQuery,
  getDuplicates,
  setSortBy,
  // setRetrievedData,
} = catalogSlice.actions;

export default catalogSlice.reducer;

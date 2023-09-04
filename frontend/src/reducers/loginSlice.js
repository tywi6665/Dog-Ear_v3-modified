import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isAuthenticated: false,
    user: {},
    token: "",
  },
  reducers: {
    setToken: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    unsetCurrentUser: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      state.token = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setCurrentUser, unsetCurrentUser } =
  loginSlice.actions;

export default loginSlice.reducer;

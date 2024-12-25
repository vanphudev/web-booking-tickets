import {createSlice} from "@reduxjs/toolkit";
import {userInfo, userToken} from "../../entity/enum";

const initialState = {
   userInfo: userInfo,
   userToken: userToken,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setUserInfo: (state, action) => {
         state.userInfo = action.payload;
      },
      setUserToken: (state, action) => {
         state.userToken = action.payload;
      },
      logout: (state) => {
         state.userInfo = null;
         state.userToken = null;
      },
      setUserInfoAndUserToken: (state, action) => {
         state.userInfo = action.payload.userInfo;
         state.userToken = action.payload.userToken;
      },
      clearUserInfoAndUserToken: (state) => {
         state.userInfo = null;
         state.userToken = null;
      },
   },
});

export const {setUserInfo, setUserToken, logout, setUserInfoAndUserToken, clearUserInfoAndUserToken} =
   authSlice.actions;
export default authSlice.reducer;

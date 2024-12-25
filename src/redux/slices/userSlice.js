import {createSlice} from "@reduxjs/toolkit";
import {userInfo} from "@/entity/enum";

const initialState = {
   userInfo: userInfo,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUserInfo: (state, action) => {
         state.userInfo = action.payload;
      },
   },
});

export const {setUserInfo} = userSlice.actions;
export default userSlice.reducer;

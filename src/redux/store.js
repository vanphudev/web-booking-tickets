import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import addressSlice from "./slices/addressSlice";

export const store = configureStore({
   reducer: {auth: authSlice, user: userSlice, address: addressSlice},
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = () => useSelector();
export default store;

import {createSlice} from "@reduxjs/toolkit";

const initialState = {
   provinces: [],
   districts: [],
   wards: [],
};

const addressSlice = createSlice({
   name: "address",
   initialState,
   reducers: {
      setProvinces: (state, action) => {
         state.provinces = action.payload;
      },
      setDistricts: (state, action) => {
         state.districts = action.payload;
      },
      setWards: (state, action) => {
         state.wards = action.payload;
      },
   },
});

export const {setProvinces, setDistricts, setWards} = addressSlice.actions;
export default addressSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./UserInfoSlice";

const store = configureStore({
  reducer: {
    userinfo: UserInfoSlice,
  },
});

export default store;

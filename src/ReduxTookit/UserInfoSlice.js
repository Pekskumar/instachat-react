import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Token: localStorage.getItem("Token") ? localStorage.getItem("Token") : null,

  UserInfo: localStorage.getItem("UserInfo")
    ? JSON.parse(localStorage.getItem("UserInfo"))
    : [],
    NoticeCount: localStorage.getItem("NoticeCount")
    ? Number(localStorage.getItem("NoticeCount")) || 0
    : 0,
};

const UserInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userToken: (state, action) => {
      state.Token = action.payload;
      localStorage.setItem("Token", action.payload);
    },
    userInfo: (state, action) => {
      state.UserInfo = action.payload;
      localStorage.setItem("UserInfo", JSON.stringify(action.payload));
    },
    noticeCount: (state, action) => {
      state.NoticeCount = action.payload;
      localStorage.setItem("NoticeCount", action.payload.toString());
    },
  },
});
export const { userToken, userInfo, noticeCount } = UserInfoSlice.actions;
export default UserInfoSlice.reducer;

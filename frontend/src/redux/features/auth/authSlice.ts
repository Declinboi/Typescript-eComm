import { createSlice } from "@reduxjs/toolkit";

const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return null;
  }
};

const initialState = {
  userInfo: getUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime.toString());

      // ✅ Save token in cookies instead of localStorage
      if (action.payload.token) {
        document.cookie = `token=${action.payload.token}; max-age=${30 * 24 * 60 * 60}; path=/; secure; samesite=strict`;
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");

      // ❌ Clear cookie
      document.cookie = "token=; max-age=0; path=/;";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

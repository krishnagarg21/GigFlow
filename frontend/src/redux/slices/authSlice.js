import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/register", formData, {withCredentials: true});
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/login", formData, {withCredentials: true});
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async () => {
    try {
      const res = await api.get("/api/auth/me", {withCredentials: true});
      return res.data;
    } catch {
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/auth/logout");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthChecked: false, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
    
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

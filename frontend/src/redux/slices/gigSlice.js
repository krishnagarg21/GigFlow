import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch open gigs
export const fetchGigs = createAsyncThunk(
  "gigs/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/gigs");
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch gigs");
    }
  }
);

// Create gig
export const createGig = createAsyncThunk(
  "gigs/create",
  async (gigData, thunkAPI) => {
    try {
      const res = await api.post("/api/gigs", gigData);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create gig");
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default gigSlice.reducer;

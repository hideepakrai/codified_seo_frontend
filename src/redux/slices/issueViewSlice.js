import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchIssueView = createAsyncThunk(
  "issues/fetchIssueView",
  async ({ pid, eid }, { rejectWithValue, getState }) => {
    try {
      const currentPage = getState().issueview.currentPage;
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URI
        }/issues/view?pid=${pid}&eid=${eid}&page=${currentPage}&uid=${userId}`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        return response.data.data;
      } else {
        return rejectWithValue("Failed to Get Issues");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const issueViewSlice = createSlice({
  name: "issueView",
  initialState: {
    loading: false,
    error: null,
    data: {},
    currentPage: 1,
  },

  reducers: {
    handleNextPage: (state, action) => {
      state.currentPage = Math.max(state.currentPage + 1, action.payload);
    },
    handlePrevPage: (state) => {
      state.currentPage = Math.max(state.currentPage - 1, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssueView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueView.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchIssueView.rejected, (state, action) => {
        state.loading = false;
        state.data = {};
        state.error = action.payload || action.error.message;
      });
  },
});

export const { handleNextPage, handlePrevPage } = issueViewSlice.actions;

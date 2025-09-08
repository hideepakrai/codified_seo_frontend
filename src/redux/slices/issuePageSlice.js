import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllIssues = createAsyncThunk(
  "issues/fetchAllIssues",
  async (id, { rejectWithValue }) => {
    try {
      const allData = JSON.parse(localStorage.getItem("issue_data") || "{}");

      if (id in allData) {
        return {
          Project: allData[id].Project,
          Crawl: allData[id].Crawl,
          Issues: allData[id].Issues,
        };
      }
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/issues?pid=${id}&uid=${userId}`,
        { withCredentials: true }
      );

      allData[id] = {
        Project: response.data.data.ProjectView.Project,
        Crawl: response.data.data.ProjectView.Crawl,
        Issues: response.data.data.IssueCount,
      };

      if (response.data.ok) {
        localStorage.setItem("issue_data", JSON.stringify(allData));
        return {
          Project: response.data.data.ProjectView.Project,
          Crawl: response.data.data.ProjectView.Crawl,
          Issues: response.data.data.IssueCount,
          previd: id,
        };
      } else {
        return rejectWithValue("Failed to Get All Issues");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const issuePageSlice = createSlice({
  name: "issuePage",
  initialState: {
    loading: false,
    error: null,
    Project: {},
    Crawl: {},
    Issues: {},
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.Crawl = action.payload.Crawl;
        state.Project = action.payload.Project;
        state.Issues = action.payload.Issues;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllIssues.rejected, (state, action) => {
        state.loading = false;
        state.Crawl = {};
        state.Project = {};
        state.Issues = {};
        state.error = action.payload || action.error.message;
      });
  },
});

export const {} = issuePageSlice.actions;

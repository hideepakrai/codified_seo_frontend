import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSingleIssue = createAsyncThunk(
  "issues/fetchSingleIssue",
  async (
    { pid, rid, eid, selectedOption, currentPage },
    { rejectWithValue }
  ) => {
    try {
      console.log(pid, rid, eid, selectedOption, currentPage);
      //   const allData = JSON.parse(localStorage.getItem("issue_data") || "{}");

      //   if (id in allData) {
      //     return {
      //       Project: allData[id].Project,
      //       Crawl: allData[id].Crawl,
      //       Issues: allData[id].Issues,
      //     };
      //   }
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URI
        }/resources?pid=${pid}&rid=${rid}&eid=${eid}&t=${selectedOption}&p=${currentPage}&uid=${userId}`,
        { withCredentials: true }
      );

      //   allData[id] = {
      //     Project: response.data.data.ProjectView.Project,
      //     Crawl: response.data.data.ProjectView.Crawl,
      //     Issues: response.data.data.IssueCount,
      //   };

      if (response.data.ok) {
        // localStorage.setItem("issue_data", JSON.stringify(allData));
        return {
          data: response.data.data,
          currentPage:
            response.data.data.page_report_view.Paginator.CurrentPage,
        };
      } else {
        return rejectWithValue("Failed");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const singleIssueSlice = createSlice({
  name: "singleIssue",
  initialState: {
    loading: false,
    error: null,
    data: {},
    selectedOption: "details",
    currentPage: 1,
  },

  reducers: {
    handlePrevPage: (state) => {
      state.currentPage = state.currentPage - 1;
    },
    handleNextPage: (state) => {
      state.currentPage = state.currentPage + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleIssue.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSingleIssue.rejected, (state, action) => {
        state.loading = false;
        state.currentPage = 1;
        state.data = {};
        state.error = action.payload || action.error.message;
      });
  },
});

export const { handlePrevPage, handleNextPage } = singleIssueSlice.actions;

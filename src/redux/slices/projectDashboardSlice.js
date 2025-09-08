import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProjects = createAsyncThunk(
  "projectDashboard/fetchAllProjects",
  async (id, { rejectWithValue, getState }) => {
    try {
      const allData = JSON.parse(
        localStorage.getItem("dashboard_data") || "{}"
      );

      if (id in allData) {
        return {
          data: allData[id].data,
          projectView: allData[id].projectView,
        };
      }
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/dashboard?pid=${id}&uid=${userId}`,
        {
          withCredentials: true,
        }
      );

      allData[id] = {
        data: response.data.data,
        projectView: response.data.data.project_view,
      };

      if (response.data.ok) {
        localStorage.setItem("dashboard_data", JSON.stringify(allData));
        return {
          data: response.data.data,
          projectView: response.data.data.project_view,
        };
      } else {
        return rejectWithValue("Failed to Fetch Data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const projectDashboardSlice = createSlice({
  name: "projectDashboard",
  initialState: {
    loading: false,
    error: null,
    data: null,
    projectView: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.projectView = action.payload.projectView;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {} = projectDashboardSlice.actions;

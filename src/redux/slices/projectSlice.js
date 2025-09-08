// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");

// export const fetchProjects = createAsyncThunk(
//   "/projects/fetchProjects",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState().projects;
//       if (state.projects && state.projects.length > 0) {
//         return state.projects;
//       }
//       const response = await axios.get(`${import.meta.env.VITE_API_URI}`, {
//         withCredentials: true,
//       });

//       if (response.data.ok) {
//         const sortedByCreated = response.data.projects.sort(
//           (a, b) =>
//             new Date(b.Project.Created).getTime() -
//             new Date(a.Project.Created).getTime()
//         );
//         return sortedByCreated;
//       } else {
//         return rejectWithValue("Failed to fetch projects");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const deleteProject = createAsyncThunk(
//   "/projects/deleteProject",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URI}/project/delete?pid=${id}`,
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.data.ok) {
//         return id;
//       } else {
//         return rejectWithValue("Failed to delete project");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchAllUsersIfAdmin = createAsyncThunk(
//   "/projects/fetchAllUsersIfAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URI}/userall`,
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.status == 200) {
//         return response.data;
//       } else {
//         return rejectWithValue("Failed As your not Admin");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const userSelect = createAsyncThunk(
//   "/projects/userSelect",
//   async (id, { rejectWithValue, getState }) => {
//     try {
//       if (id == "Normal") {
//         localStorage.removeItem("userid");
//         return {
//           viewother: false,
//           selectedValue: "Normal",
//           projects: [],
//         };
//       }
//       localStorage.setItem("userid", id);

//       const { allUsers } = getState().projects;

//       const user = allUsers?.user?.find((d) => d.Id == id);
//       if (!user) {
//         return rejectWithValue("User not found");
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URI}/user/project?email=${user.Email}`,
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.status == 200) {
//         return {
//           viewother: true,
//           selectedValue: id,
//           projects: response.data.projects || [],
//         };
//       } else {
//         return rejectWithValue("Failed to fetch user projects");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const projectSlice = createSlice({
//   name: "projects",
//   initialState: {
//     loading: false,
//     error: null,
//     projects: storedProjects,
//     selectedValue: "Normal",
//     viewother: false,
//     allUsers: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.projects = action.payload;
//         state.loading = false;
//         localStorage.setItem("projects", JSON.stringify(state.projects));
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//       })
//       .addCase(deleteProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteProject.fulfilled, (state, action) => {
//         state.projects = state.projects.filter(
//           (project) => project.Id != action.payload
//         );
//         state.loading = false;
//         localStorage.setItem("projects", JSON.stringify(state.projects));
//       })
//       .addCase(deleteProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//       })
//       .addCase(fetchAllUsersIfAdmin.fulfilled, (state, action) => {
//         state.allUsers = action.payload;
//       })
//       .addCase(fetchAllUsersIfAdmin.rejected, (state) => {
//         state.allUsers = [];
//       })
//       .addCase(userSelect.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(userSelect.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = action.payload.projects;
//         state.selectedValue = action.payload.selectedValue;
//         state.viewother = action.payload.viewother;
//         localStorage.setItem("projects", JSON.stringify(state.projects));
//       })
//       .addCase(userSelect.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//         state.projects = [];
//       });
//   },
// });

// export const {} = projectSlice.actions;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function loadCachedProjects() {
  try {
    const cached = JSON.parse(localStorage.getItem("projects") || "null");
    if (cached && cached.projects && cached.fetchedAt) {
      return cached;
    }
    return { projects: [], fetchedAt: 0 };
  } catch {
    return { projects: [], fetchedAt: 0 };
  }
}

const { projects: storedProjects } = loadCachedProjects();

export const fetchProjects = createAsyncThunk(
  "/projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      // Check localStorage freshness
      const cached = loadCachedProjects();
      const now = Date.now();
      if (cached.projects.length > 0 && now - cached.fetchedAt < CACHE_TTL) {
        return cached.projects;
      }

      // Otherwise, fetch from API
      const response = await axios.get(`${import.meta.env.VITE_API_URI}`, {
        withCredentials: true,
      });

      if (response.data.ok) {
        const sortedByCreated = response.data.projects.sort(
          (a, b) =>
            new Date(b.Project.Created).getTime() -
            new Date(a.Project.Created).getTime()
        );

        // Save fresh cache
        localStorage.setItem(
          "projects",
          JSON.stringify({ projects: sortedByCreated, fetchedAt: now })
        );

        return sortedByCreated;
      } else {
        return rejectWithValue("Failed to fetch projects");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "/projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/project/delete?pid=${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        return id;
      } else {
        return rejectWithValue("Failed to delete project");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllUsersIfAdmin = createAsyncThunk(
  "/projects/fetchAllUsersIfAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/userall`,
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        return response.data;
      } else {
        return rejectWithValue("Failed As your not Admin");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const userSelect = createAsyncThunk(
  "/projects/userSelect",
  async (id, { rejectWithValue, getState }) => {
    try {
      if (id === "Normal") {
        localStorage.removeItem("userid");
        return {
          viewother: false,
          selectedValue: "Normal",
          projects: [],
        };
      }
      localStorage.setItem("userid", id);

      const { allUsers } = getState().projects;

      const user = allUsers?.user?.find((d) => d.Id == id);
      if (!user) {
        return rejectWithValue("User not found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/user/project?email=${user.Email}`,
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        const now = Date.now();
        const projects = response.data.projects || [];

        // Cache this user's projects too
        localStorage.setItem(
          "projects",
          JSON.stringify({ projects, fetchedAt: now })
        );

        return {
          viewother: true,
          selectedValue: id,
          projects,
        };
      } else {
        return rejectWithValue("Failed to fetch user projects");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const projectSlice = createSlice({
  name: "projects",
  initialState: {
    loading: false,
    error: null,
    projects: storedProjects,
    selectedValue: "Normal",
    viewother: false,
    allUsers: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.Id != action.payload
        );
        state.loading = false;

        // update cache after deletion
        localStorage.setItem(
          "projects",
          JSON.stringify({ projects: state.projects, fetchedAt: Date.now() })
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllUsersIfAdmin.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsersIfAdmin.rejected, (state) => {
        state.allUsers = [];
      })
      .addCase(userSelect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSelect.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.selectedValue = action.payload.selectedValue;
        state.viewother = action.payload.viewother;
      })
      .addCase(userSelect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.projects = [];
      });
  },
});

export const {} = projectSlice.actions;

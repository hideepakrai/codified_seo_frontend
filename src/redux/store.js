import { configureStore } from "@reduxjs/toolkit";

import { projectDashboardSlice } from "./slices/projectDashboardSlice";
import { projectSlice } from "./slices/projectSlice";
import { issuePageSlice } from "./slices/issuePageSlice";
import { issueViewSlice } from "./slices/issueViewSlice";
import { singleIssueSlice } from "./slices/singleIssueSlice";

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
    dashboard: projectDashboardSlice.reducer,
    issues: issuePageSlice.reducer,
    issueview: issueViewSlice.reducer,
    singleissue: singleIssueSlice.reducer,
  },
});

// src/App.js
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";

import Icon from "./Icon";
import Login from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import Companies from "./Companies";
import SavedJobs from "./SavedJobs";
import Apply from "./Apply";
import Submissions from "./Submissions";
import Select from "./Select";
import Email from "./Email";
import More from "./More";

import ProtectedRoute from "./ProtectedRoute";

const router = createHashRouter([
  { path: "/", element: <Icon /> },
  { path: "/login", element: <Login /> },

  { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: "/admin", element: <ProtectedRoute role="admin"><Admin /></ProtectedRoute> },
  { path: "/companies", element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: "/savedjobs", element: <ProtectedRoute><SavedJobs /></ProtectedRoute> },
  { path: "/apply", element: <ProtectedRoute><Apply /></ProtectedRoute> },
  { path: "/submissions", element: <ProtectedRoute><Submissions /></ProtectedRoute> },
  { path: "/select", element: <ProtectedRoute><Select /></ProtectedRoute> },
  { path: "/email", element: <ProtectedRoute><Email /></ProtectedRoute> },
  { path: "/more", element: <ProtectedRoute><More /></ProtectedRoute> },
]);


function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

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

  // Normal user pages
  { path: "/home", element: <ProtectedRoute role="user"><Home /></ProtectedRoute> },

  // Admin pages
  { path: "/admin", element: <ProtectedRoute role="admin"><Admin /></ProtectedRoute> },

  { path: "/companies", element: <ProtectedRoute role="user"><Companies /></ProtectedRoute> },
  { path: "/savedjobs", element: <ProtectedRoute role="user"><SavedJobs /></ProtectedRoute> },
  { path: "/apply", element: <ProtectedRoute role="user"><Apply /></ProtectedRoute> },
  { path: "/submissions", element: <ProtectedRoute role="user"><Submissions /></ProtectedRoute> },
  { path: "/select", element: <ProtectedRoute role="user"><Select /></ProtectedRoute> },
  { path: "/email", element: <ProtectedRoute role="user"><Email /></ProtectedRoute> },
  { path: "/more", element: <ProtectedRoute role="user"><More /></ProtectedRoute> },
]);



function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

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

  { path: "/home", element: <ProtectedRoute element={<Home />} /> },
  { path: "/admin", element: <ProtectedRoute element={<Admin />} requiresAdmin={true} /> },
  { path: "/companies", element: <ProtectedRoute element={<Companies />} /> },
  { path: "/savedjobs", element: <ProtectedRoute element={<SavedJobs />} /> },
  { path: "/apply", element: <ProtectedRoute element={<Apply />} /> },
  { path: "/submissions", element: <ProtectedRoute element={<Submissions />} /> },
  { path: "/select", element: <ProtectedRoute element={<Select />} /> },
  { path: "/email", element: <ProtectedRoute element={<Email />} /> },
  { path: "/more", element: <ProtectedRoute element={<More />} /> },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

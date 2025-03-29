import { createHashRouter, RouterProvider } from "react-router-dom";
import Icon from "./Icon";
import Login from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import Companies from "./Companies";
import SavedJobs from "./SavedJobs";
import Apply from "./Apply";
import Submissions from "./Submissions";

const router = createHashRouter([
  {
    path: "/",
    element: <Icon />,
  },
 
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/companies",
    element: <Companies />,
  },
  {
    path: "/savedjobs",
    element: <SavedJobs />,
  },
  {
    path: "/apply",
    element: <Apply />,
  },
  {
    path: "/submissions",
    element: <Submissions />,
  }
]);

function App() {

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isAuthenticated = localStorage.getItem("authenticatedUser");

  return <RouterProvider router={router} />;
}

export default App;

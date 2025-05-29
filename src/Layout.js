import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";

function Layout() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

export default Layout;

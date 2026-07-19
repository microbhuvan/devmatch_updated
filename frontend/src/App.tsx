import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import AuthLoader from "./components/auth/AuthLoader";
import ToastContainer from "./components/common/ToastContainer";
import type { RootState } from "./redux/store";

function App() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("devmatch-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [darkMode]);

  return (
    <AuthLoader>
      <AppRoutes />
      <ToastContainer />
    </AuthLoader>
  );
}

export default App;


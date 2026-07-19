import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../redux/store";

const OnboardingRoute = () => {
  const { hasProfile } = useSelector((state: RootState) => state.profile);

  if (!hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default OnboardingRoute;

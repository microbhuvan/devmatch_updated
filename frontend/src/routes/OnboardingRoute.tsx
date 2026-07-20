import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../redux/store";

const OnboardingRoute = () => {
  const { hasProfile } = useSelector((state: RootState) => state.profile);

  if (hasProfile === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (hasProfile === false) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default OnboardingRoute;

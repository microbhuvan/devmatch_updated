import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CreateProfile from "../pages/CreateProfile";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Connections from "../pages/Connections";
import Chat from "../pages/Chat";
import Upgrade from "../pages/Upgrade";
import ReceivedRequests from "../pages/ReceivedRequests";
import SentRequests from "../pages/SentRequests";

import ProtectedRoute from "./ProtectedRoute";
import OnboardingRoute from "./OnboardingRoute";
import AppLayout from "../layout/AppLayout";
import Chats from "../pages/Chats";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public ---------- */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- Protected ---------- */}

        <Route element={<ProtectedRoute />}>
          <Route path="/create-profile" element={<CreateProfile />} />

          {/* ---------- Profile Completed ---------- */}

          <Route element={<OnboardingRoute />}>
            {/* Every page below gets AppNavbar automatically */}
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<Feed />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />

              <Route path="/change-password" element={<ChangePassword />} />

              <Route path="/requests" element={<ReceivedRequests />} />

              <Route path="/sent-requests" element={<SentRequests />} />

              <Route path="/connections" element={<Connections />} />

              <Route path="/chat" element={<Chats />} />

              <Route path="/chat/:conversationId" element={<Chat />} />

              <Route path="/upgrade" element={<Upgrade />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

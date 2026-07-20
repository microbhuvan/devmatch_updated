import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket/socket";

import { getCurrentUser } from "../../services/auth.service";
import { getMyProfile } from "../../services/profile.service";
import { logout } from "../../redux/slices/authSlice";
import { setUser } from "../../redux/slices/authSlice";

import {
  setProfile,
  setNoProfile,
  clearProfile,
} from "../../redux/slices/profileSlice";

interface Props {
  children: React.ReactNode;
}

const AuthLoader = ({ children }: Props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.count("auth loader useeffect");
    const initializeApp = async () => {
      try {
        // Restore logged-in user
        console.count("intializeapp");
        const userData = await getCurrentUser();

        dispatch(setUser(userData.user));
        socket.connect();

        try {
          const profileData = await getMyProfile();

          dispatch(setProfile(profileData.profile));
        } catch {
          dispatch(setNoProfile());
        }
      } catch {
        dispatch(logout());
        dispatch(clearProfile());
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLoader;

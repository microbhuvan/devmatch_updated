import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket/socket";

import { getCurrentUser } from "../../services/auth.service";
import { getMyProfile } from "../../services/profile.service";

import { setUser } from "../../redux/slices/authSlice";
import { setProfile } from "../../redux/slices/profileSlice";

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
          // Restore profile if it exists
          const profileData = await getMyProfile();

          dispatch(setProfile(profileData.profile));
        } catch {
          // User is authenticated but profile doesn't exist yet.
        }
      } catch {
        // User is not authenticated.
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

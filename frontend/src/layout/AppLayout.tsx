import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "../components/app/Navbar";

import { getReceivedRequests } from "../services/request.service";
import { setPendingRequestCount } from "../redux/slices/notificationSlice";

const AppLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getReceivedRequests();

        dispatch(setPendingRequestCount(response.requests.length));
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl p-4 sm:p-6">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;

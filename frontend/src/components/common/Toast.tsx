import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

import { removeToast } from "../../redux/slices/notificationSlice";
import type { Toast as ToastType } from "../../redux/slices/notificationSlice";

interface ToastProps {
  toast: ToastType;
}

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const TOAST_CLASSES = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
};

const Toast = ({ toast }: ToastProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, dispatch]);

  const handleDismiss = () => {
    dispatch(removeToast(toast.id));
  };

  return (
    <div
      role="alert"
      className={`alert shadow-lg pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-lg ${
        TOAST_CLASSES[toast.type]
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{ICONS[toast.type]}</span>
        <span>{toast.message}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="btn btn-ghost btn-sm"
        aria-label="Dismiss notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;

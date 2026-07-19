import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Toast from "./Toast";

const ToastContainer = () => {
  const toasts = useSelector((state: RootState) => state.notification.toasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;

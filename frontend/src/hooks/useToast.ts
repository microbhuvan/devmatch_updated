import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../redux/slices/notificationSlice";

export const useToast = () => {
  const dispatch = useDispatch();

  const success = useCallback(
    (message: string) => {
      dispatch(addToast(message, "success"));
    },
    [dispatch],
  );

  const error = useCallback(
    (message: string) => {
      dispatch(addToast(message, "error"));
    },
    [dispatch],
  );

  const info = useCallback(
    (message: string) => {
      dispatch(addToast(message, "info"));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      success,
      error,
      info,
    }),
    [success, error, info],
  );
};

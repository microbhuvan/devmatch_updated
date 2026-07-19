import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/auth.service";
import { useToast } from "../hooks/useToast";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    setToken(tokenFromUrl);
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = { newPassword: "", confirmPassword: "" };
    let isValid = true;

    if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token || !validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({ token, newPassword });
      toast.success(res.message);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        (axios.isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message
          : undefined) ?? "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!token) {
      return (
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-error" />
          <h2 className="card-title justify-center text-2xl">
            Invalid Link
          </h2>
          <p className="my-4">
            The password reset link is missing or invalid. Please request a new
            one.
          </p>
          <Link to="/forgot-password" className="btn btn-primary btn-block">
            Request New Link
          </Link>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="text-center">
          <FaCheckCircle className="mx-auto mb-4 text-5xl text-success" />
          <h2 className="card-title justify-center text-2xl">
            Password Reset!
          </h2>
          <p className="my-4">
            Your password has been changed successfully.
          </p>
          <Link to="/login" className="btn btn-primary btn-block">
            Proceed to Login
          </Link>
        </div>
      );
    }

    return (
      <>
        <h2 className="text-3xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-base-content/60 mb-4">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="newPassword" className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              id="newPassword"
              type="password"
              className={`input input-bordered w-full ${errors.newPassword ? "input-error" : ""}`}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoFocus
            />
            {errors.newPassword && <p className="mt-1 text-xs text-error">{errors.newPassword}</p>}
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>}
          </div>

          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

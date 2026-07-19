import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";

import { changePassword } from "../services/auth.service";
import { logout } from "../redux/slices/authSlice";
import { useToast } from "../hooks/useToast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
      isValid = false;
    }

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters.";
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    
    if (formData.currentPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from the current one.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setIsSuccess(true);
      toast.success(data.message);
      dispatch(logout());
    } catch (err: unknown) {
      const message = (axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined) || "Failed to change password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          {isSuccess ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto mb-4 text-5xl text-success" />
              <h2 className="card-title justify-center text-2xl">
                Password Changed!
              </h2>
              <p className="my-4">
                Your password has been changed successfully. Please login again
                with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary btn-block"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="card-title justify-center text-3xl">
                Change Password
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="currentPassword">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Current Password"
                    className={`input input-bordered w-full ${errors.currentPassword ? "input-error" : ""}`}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.currentPassword && <p className="mt-1 text-xs text-error">{errors.currentPassword}</p>}
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="newPassword">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    className={`input input-bordered w-full ${errors.newPassword ? "input-error" : ""}`}
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.newPassword && <p className="mt-1 text-xs text-error">{errors.newPassword}</p>}
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="confirmPassword">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>}
                </div>

                <button
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner"/> : "Change Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

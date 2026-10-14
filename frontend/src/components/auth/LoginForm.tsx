import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import { login } from "../../services/auth.service";
import { setUser } from "../../redux/slices/authSlice";
import { useToast } from "../../hooks/useToast";
import { getMyProfile } from "../../services/profile.service";
import { setProfile, setNoProfile } from "../../redux/slices/profileSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (formData.username.length < 2 || formData.username.length > 50) {
      newErrors.username = "Username must be between 2 and 50 characters.";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await login(formData);
      dispatch(setUser(data.user));

      try {
        const profileData = await getMyProfile();
        dispatch(setProfile(profileData.profile));
      } catch {
        dispatch(setNoProfile());
      }

      toast.success(`Welcome back, ${data.user.username}!`);
      navigate("/feed");
    } catch (err: unknown) {
      const message =
        (axios.isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message
          : undefined) || "Login failed. Please check your credentials.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6 md:p-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Welcome Back</h1>

      <p className="mb-6 text-sm text-base-content/60 sm:mb-8 sm:text-base">
        Login to continue to DevMatch.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="username" className="label">
            <span className="label-text">Username</span>
          </label>

          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.username ? "input-error" : ""
            }`}
            autoComplete="username"
            required
            autoFocus
          />

          {errors.username && (
            <p className="mt-1 text-xs text-error">{errors.username}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`input input-bordered w-full pr-12 ${
                errors.password ? "input-error" : ""
              }`}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-base-content/60 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-lg"
            >
              {showPassword ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? <span className="loading loading-spinner" /> : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;

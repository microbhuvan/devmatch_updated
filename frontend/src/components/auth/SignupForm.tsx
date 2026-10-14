import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import { signup } from "../../services/auth.service";
import { setUser } from "../../redux/slices/authSlice";
import { useToast } from "../../hooks/useToast";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.username.length < 2 || formData.username.length > 50) {
      newErrors.username = "Username must be between 2 and 50 characters.";
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      dispatch(setUser(data.user));
      toast.success("Account created successfully!");
      navigate("/create-profile");
    } catch (err: unknown) {
      const message =
        (axios.isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message
          : undefined) || "Signup failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6 md:p-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Create Account</h1>

      <p className="mb-6 text-sm text-base-content/60 sm:mb-8 sm:text-base">
        Join DevMatch today.
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
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : ""
            }`}
            autoComplete="email"
            required
          />

          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email}</p>
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
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-lg px-3 text-base-content/60 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

        <div className="form-control">
          <label htmlFor="confirmPassword" className="label">
            <span className="label-text">Confirm Password</span>
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input input-bordered w-full pr-12 ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-lg px-3 text-base-content/60 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="loading loading-spinner" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;

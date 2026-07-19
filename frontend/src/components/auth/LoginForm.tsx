import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../services/auth.service";
import { setUser } from "../../redux/slices/authSlice";
import { useToast } from "../../hooks/useToast";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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

    if (
      formData.username.length < 2 ||
      formData.username.length > 50
    ) {
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

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data = await login(formData);
      dispatch(setUser(data.user));
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate("/feed");
    } catch (err: unknown) {
      const message = (axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined) || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
      <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
      <p className="mb-8 text-base-content/60">Login to continue to DevMatch.</p>

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
            className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
            required
            autoFocus
          />
          {errors.username && <p className="mt-1 text-xs text-error">{errors.username}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="password"  className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
            required
          />
           {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
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
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? <span className="loading loading-spinner" /> : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;

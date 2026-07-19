import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/auth.service";
import { useToast } from "../hooks/useToast";
import { FaCheckCircle } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const toast = useToast();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      toast.success(res.message);
      setFormSubmitted(true);
    } catch (err: unknown) {
      const message =
        (axios.isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message
          : undefined) || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {formSubmitted ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto mb-4 text-5xl text-success" />
              <h2 className="card-title justify-center text-2xl">
                Check your inbox
              </h2>
              <p className="my-4">
                If an account exists for <strong>{email}</strong>, you will
                receive an email with a link to reset your password.
              </p>
              <Link to="/login" className="btn btn-primary btn-block">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="card-title justify-center text-3xl">
                Forgot Password
              </h2>
              <p className="mb-4 text-center text-base-content/60">
                Enter your email and we'll send you a password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className={`input input-bordered w-full ${error ? "input-error" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  {error && <p className="mt-1 text-xs text-error">{error}</p>}
                </div>

                <button className="btn btn-primary w-full" disabled={loading}>
                  {loading ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="link-primary link">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

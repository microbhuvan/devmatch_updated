import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login/signup attempts. Please try again later.",
  },
});

export const refreshLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many refresh requests. Please try again later.",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please slow down.",
  },
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many OTP requests. Please try again later.",
  },
});

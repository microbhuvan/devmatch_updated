import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Crown } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createOrder, getPaymentStatus } from "../services/payment.service";
import { getCurrentUser } from "../services/auth.service";
import { setUser } from "../redux/slices/authSlice";
import { useToast } from "../hooks/useToast";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: string;
      }) => Promise<{
        error?: { message?: string };
      }>;
    };
  }
}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

const Upgrade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshUser = async () => {
    const response = await getCurrentUser();

    if (!response?.user) {
      throw new Error("Unable to fetch the current user");
    }

    dispatch(setUser(response.user));
    return response.user;
  };

  const handleUpgrade = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (!window.Cashfree) {
      toast.error("Cashfree checkout could not be loaded.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create the order on the backend.
      const order = await createOrder(phone);

      if (!order?.orderId || !order?.paymentSessionId) {
        throw new Error("Invalid order response from the backend");
      }

      // 2. Open Cashfree checkout.
      const cashfree = window.Cashfree({
        mode:
          import.meta.env.VITE_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      });

      const checkoutResult = await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_modal",
      });

      // Do not trust the checkout result alone.
      // The backend must confirm the payment.
      let paymentConfirmed = false;

      for (let attempt = 0; attempt < 15; attempt++) {
        try {
          const status = await getPaymentStatus(order.orderId);

          if (status.verified && status.status === "paid") {
            paymentConfirmed = true;
            break;
          }

          if (status.status === "failed") {
            break;
          }
        } catch (error) {
          // A temporary request failure should not immediately
          // prevent the next status check.
          console.warn("Payment status check failed:", error);
        }

        if (attempt < 14) {
          await wait(2000);
        }
      }

      // 3. Refresh the authenticated user from the backend,
      // even if polling timed out.
      const user = await refreshUser();

      // 4. Use the actual account status to decide what happens next.
      if (user.isPremium) {
        toast.success(
          paymentConfirmed
            ? "Payment verified! Welcome to DevMatch Premium."
            : "Your DevMatch Premium access is active.",
        );

        navigate("/search");
        return;
      }

      if (paymentConfirmed) {
        toast.error(
          "Payment was verified, but premium access has not updated yet. Please refresh your account shortly.",
        );
        return;
      }

      if (checkoutResult?.error) {
        toast.error(
          checkoutResult.error.message ||
            "Payment was not confirmed. Please check your payment status.",
        );
        return;
      }

      toast.error(
        "Payment is not confirmed yet. Please check again shortly. Do not pay again until you verify the existing transaction.",
      );
    } catch (error) {
      console.error("Cashfree checkout error:", error);
      toast.error(
        "Unable to complete the payment flow. Please check your connection and payment status.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-8">
        <div className="flex justify-center">
          <Crown size={64} className="text-warning" />
        </div>

        <p className="mt-4 text-center text-sm font-semibold uppercase tracking-wide text-primary">
          DevMatch Premium
        </p>

        <h1 className="mt-2 text-center text-3xl font-bold sm:text-4xl">
          Unlock Premium Features
        </h1>

        <p className="mt-4 text-center text-base-content/70">
          Upgrade once and unlock exclusive features designed to help you
          discover developers faster.
        </p>

        <div className="mt-8 text-center">
          <p className="text-5xl font-bold">₹10</p>
          <p className="mt-2 text-sm text-base-content/60">One-time payment</p>
        </div>

        <ul className="mt-10 space-y-4">
          <li className="flex items-center gap-3">
            <FaCheck className="text-primary" />
            <span>Search developers by username</span>
          </li>

          <li className="flex items-center gap-3">
            <FaCheck className="text-primary" />
            <span>Search developers by skills</span>
          </li>

          <li className="flex items-center gap-3">
            <FaCheck className="text-primary" />
            <span>Premium badge on your profile</span>
          </li>
        </ul>

        <div className="mt-10">
          <label
            htmlFor="payment-phone"
            className="mb-2 block text-sm font-medium"
          >
            Mobile number
          </label>

          <input
            id="payment-phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 10-digit mobile number"
            className="input input-bordered w-full"
            disabled={loading}
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Processing..." : "Upgrade to Premium"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Upgrade;

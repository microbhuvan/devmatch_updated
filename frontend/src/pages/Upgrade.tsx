import { FaCheck } from "react-icons/fa";
import { Crown } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createOrder, verifyPayment } from "../services/payment.service";
import { getCurrentUser } from "../services/auth.service";
import { setUser } from "../redux/slices/authSlice";
import { useToast } from "../hooks/useToast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Upgrade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleUpgrade = async () => {
    try {
      const order = await createOrder();

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,

        name: "DevMatch",
        description: "DevMatch Premium Membership",

        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            const { user } = await getCurrentUser();

            dispatch(setUser(user));

            toast.success("Welcome to DevMatch Premium!");

            navigate("/search");
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to start payment.");
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
          <button onClick={handleUpgrade} className="btn btn-primary w-full">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </section>
  );
};

export default Upgrade;

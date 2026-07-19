import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const Upgrade = () => {
  return (
    <section className="mx-auto max-w-2xl py-8 sm:py-12">
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">DevMatch Premium</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Built for developers who want more reach.</h1>
        <p className="mt-4 text-base-content/70">
          Premium is currently being prepared. Your existing connections, chats, and profile remain available as usual.
        </p>
        <ul className="mt-6 space-y-3 text-sm sm:text-base">
          <li className="flex gap-3"><FaCheck className="mt-1 shrink-0 text-primary" />Priority profile visibility</li>
          <li className="flex gap-3"><FaCheck className="mt-1 shrink-0 text-primary" />More developer discovery options</li>
          <li className="flex gap-3"><FaCheck className="mt-1 shrink-0 text-primary" />Simple monthly plan when launched</li>
        </ul>
        <Link to="/feed" className="btn btn-primary mt-8">Back to feed</Link>
      </div>
    </section>
  );
};

export default Upgrade;

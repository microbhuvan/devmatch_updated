import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:gap-16 lg:flex-row">
      {/* LEFT */}

      <div className="flex-1">
        <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Built for Developers
        </span>

        <h1 className="mt-6 text-5xl font-extrabold leading-tight lg:text-7xl">
          Meet Developers.
          <br />
          Build Projects.
          <br />
          Grow Together.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-base-content/70">
          Discover developers with similar interests, connect with them,
          collaborate on exciting projects, and chat in real time.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
            <FaArrowRight />
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-base-300 px-5 py-3 font-semibold transition hover:bg-base-200"
          >
            Login
          </Link>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          {/* User */}

          <div className="mb-5 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=15"
              alt="Developer"
              className="h-14 w-14 rounded-full"
            />

            <div>
              <h3 className="font-semibold">Rahul Sharma</h3>

              <p className="text-sm text-base-content/60">MERN • React • Node.js</p>
            </div>
          </div>

          {/* Bio */}

          <p className="mb-5 text-base-content/70">
            Looking for teammates to build an AI Resume Analyzer.
          </p>

          {/* Skills */}

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              React
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Node.js
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              MongoDB
            </span>
          </div>

          {/* Buttons */}

          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600">
              Ignore
            </button>

            <button className="flex-1 rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700">
              Interested
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

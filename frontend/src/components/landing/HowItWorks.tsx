import { FaUserPlus, FaHeart, FaComments } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-12 text-center text-3xl sm:text-4xl font-bold">
        How DevMatch Works
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center sm:p-8">
          <FaUserPlus className="mx-auto mb-4 text-3xl sm:text-4xl text-indigo-600" />
          <h3 className="text-xl font-semibold">Create Profile</h3>
          <p className="mt-3 text-base-content/60">
            Tell others about your skills, interests and projects.
          </p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center sm:p-8">
          <FaHeart className="mx-auto mb-4 text-3xl sm:text-4xl text-indigo-600" />
          <h3 className="text-xl font-semibold">Find Developers</h3>
          <p className="mt-3 text-base-content/60">
            Browse developers and send connection requests.
          </p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center sm:p-8">
          <FaComments className="mx-auto mb-4 text-3xl sm:text-4xl text-indigo-600" />
          <h3 className="text-xl font-semibold">Start Chatting</h3>
          <p className="mt-3 text-base-content/60">
            Once connected, chat instantly and start building together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

const About = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-14 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            About DevMatch
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            Connecting Developers.
            <br />
            Building Together.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">
            DevMatch helps developers discover like-minded people, collaborate
            on projects, and build meaningful connections.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">What is DevMatch?</h2>

            <p className="mt-3 leading-7 text-base-content/70">
              DevMatch is a platform built for developers to discover other
              developers with similar interests and skills. Users can connect,
              collaborate on projects, and communicate in real time.
            </p>
          </section>

          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Our Mission</h2>

            <p className="mt-3 leading-7 text-base-content/70">
              Our goal is to make it easier for developers to find the right
              people to learn with, build with, and grow together.
            </p>
          </section>

          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Business Information</h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-base-content/50">Operated by</p>
                <p className="font-medium">Bhuvan Mallikarjuna</p>
              </div>

              <div>
                <p className="text-sm text-base-content/50">Email</p>
                <a
                  href="mailto:microbhuvan@gmail.com"
                  className="text-primary hover:underline"
                >
                  microbhuvan@gmail.com
                </a>
              </div>

              <div>
                <p className="text-sm text-base-content/50">Phone</p>
                <a
                  href="tel:+917975594489"
                  className="text-primary hover:underline"
                >
                  +91 7975594489
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default About;

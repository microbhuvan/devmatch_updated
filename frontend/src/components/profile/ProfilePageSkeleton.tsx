const ProfilePageSkeleton = () => {
  return (
    <div className="mx-auto mt-4 max-w-3xl animate-pulse rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:mt-10 sm:p-8">
      <div className="flex flex-col items-center">
        <div className="h-36 w-36 rounded-full bg-base-300" />
        <div className="mt-4 h-6 w-48 rounded bg-base-300" />
        <div className="mt-2 h-4 w-64 rounded bg-base-300" />
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="h-5 w-20 rounded bg-base-300" />
          <div className="mt-2 h-4 w-full rounded bg-base-300" />
          <div className="mt-2 h-4 w-3/4 rounded bg-base-300" />
        </div>

        <div>
          <div className="h-5 w-20 rounded bg-base-300" />
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-base-300" />
            <div className="h-6 w-24 rounded-full bg-base-300" />
            <div className="h-6 w-16 rounded-full bg-base-300" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="h-5 w-16 rounded bg-base-300" />
            <div className="mt-2 h-4 w-12 rounded bg-base-300" />
          </div>
          <div>
            <div className="h-5 w-16 rounded bg-base-300" />
            <div className="mt-2 h-4 w-12 rounded bg-base-300" />
          </div>
        </div>

        <div>
          <div className="h-5 w-24 rounded bg-base-300" />
          <div className="mt-2 h-4 w-full rounded bg-base-300" />
        </div>

        <div>
          <div className="h-5 w-24 rounded bg-base-300" />
          <div className="mt-2 h-4 w-full rounded bg-base-300" />
        </div>
      </div>

      <div className="mt-8">
        <div className="h-12 w-32 rounded-lg bg-base-300" />
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;

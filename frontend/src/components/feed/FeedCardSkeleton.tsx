const FeedCardSkeleton = () => {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <div className="flex animate-pulse flex-col items-center">
        <div className="h-32 w-32 rounded-full bg-base-300" />
        <div className="mt-4 h-8 w-48 rounded bg-base-300" />
        <div className="mt-3 h-4 w-full max-w-sm rounded bg-base-300" />
        <div className="mt-2 h-4 w-full max-w-xs rounded bg-base-300" />

        <div className="mt-5 flex w-full max-w-md flex-wrap justify-center gap-2">
          <div className="h-5 w-20 rounded-full bg-base-300" />
          <div className="h-5 w-24 rounded-full bg-base-300" />
          <div className="h-5 w-16 rounded-full bg-base-300" />
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <div className="h-12 flex-1 rounded-lg bg-base-300" />
          <div className="h-12 flex-1 rounded-lg bg-base-300" />
        </div>
      </div>
    </div>
  );
};

export default FeedCardSkeleton;

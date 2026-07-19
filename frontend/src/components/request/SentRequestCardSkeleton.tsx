const SentRequestCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-base-300"></div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-6 w-32 rounded bg-base-300"></div>
            <div className="h-4 w-full rounded bg-base-300 sm:w-4/5"></div>
          </div>
          <div className="h-6 w-20 rounded-full bg-base-300"></div>
          <div className="h-9 w-24 rounded-lg bg-base-300"></div>
        </div>
      </div>
    </div>
  );
};

export default SentRequestCardSkeleton;

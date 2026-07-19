const ReceivedRequestCardSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl sm:flex-row sm:items-center sm:justify-between border border-base-300 bg-base-100 p-5 shadow">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 rounded-full bg-base-300"></div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-32 rounded bg-base-300"></div>
          <div className="h-4 w-full rounded bg-base-300 sm:w-4/5"></div>
        </div>
      </div>
      <div className="flex w-full gap-3 sm:w-auto">
        <div className="h-12 w-24 flex-1 rounded-lg bg-base-300 sm:flex-none"></div>
        <div className="h-12 w-24 flex-1 rounded-lg bg-base-300 sm:flex-none"></div>
      </div>
    </div>
  );
};

export default ReceivedRequestCardSkeleton;

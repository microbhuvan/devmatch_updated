const ConnectionCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-base-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-32 rounded bg-base-300"></div>
            <div className="h-4 w-4/5 rounded bg-base-300"></div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="h-5 w-20 rounded-full bg-base-300"></div>
              <div className="h-5 w-24 rounded-full bg-base-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCardSkeleton;

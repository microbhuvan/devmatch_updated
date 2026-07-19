export const MessageBubbleSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex animate-pulse justify-start">
        <div className="h-10 w-2/5 rounded-xl bg-base-100" />
      </div>
      <div className="flex animate-pulse justify-end">
        <div className="h-16 w-1/2 rounded-xl bg-primary/20" />
      </div>
      <div className="flex animate-pulse justify-start">
        <div className="h-8 w-1/3 rounded-xl bg-base-100" />
      </div>
      <div className="flex animate-pulse justify-end">
        <div className="h-10 w-1/4 rounded-xl bg-primary/20" />
      </div>
      <div className="flex animate-pulse justify-start">
        <div className="h-12 w-3/5 rounded-xl bg-base-100" />
      </div>
    </div>
  );
};

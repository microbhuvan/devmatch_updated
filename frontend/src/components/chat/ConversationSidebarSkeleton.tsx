const ConversationSidebarSkeleton = () => {
  return (
    <div className="h-full overflow-y-auto bg-base-100">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 border-b border-base-300 p-4">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-base-300" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-base-300" />
            <div className="h-3 w-1/2 rounded bg-base-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationSidebarSkeleton;

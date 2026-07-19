import type { FeedUser } from "../../types/feed.types";

interface FeedCardProps {
  user: FeedUser;
  onConnect: (userId: string) => void;
  onIgnore: (userId: string) => void;
  loading?: boolean;
  isTopCard: boolean;
}

const FeedCard = ({ user, onConnect, onIgnore, loading = false, isTopCard }: FeedCardProps) => {
  return (
    <div
      className={`rounded-xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-6 h-full flex flex-col ${!isTopCard ? "pointer-events-none" : ""}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="avatar">
          <div className="w-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
            <img
              src={user.profile?.photoURL ?? "https://placehold.co/150x150?text=Profile"}
              alt={`Profile photo of ${user.username}`}
            />
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-bold">{user.username}</h2>

        <p className="mt-2 h-20 text-base-content/70 overflow-hidden">
          {user.profile?.about || "No bio yet."}
        </p>

        <div className="mt-5 flex h-24 flex-wrap justify-center gap-2 overflow-hidden">
          {(user.profile?.skills ?? []).map((skill) => (
            <span key={skill} className="badge badge-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col gap-3 pt-4 sm:flex-row">
        <button
          onClick={() => onIgnore(user._id)}
          disabled={loading || !isTopCard}
          className="btn btn-outline flex-1"
          aria-label={`Ignore ${user.username}`}
        >
          Ignore
        </button>

        <button
          onClick={() => onConnect(user._id)}
          disabled={loading || !isTopCard}
          className="btn btn-primary flex-1"
          aria-label={`Connect with ${user.username}`}
        >
          {loading ? <span className="loading loading-spinner"/> : "Connect"}
        </button>
      </div>
    </div>
  );
};

export default FeedCard;

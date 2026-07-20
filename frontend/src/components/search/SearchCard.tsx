import type { SearchUser } from "../../types/search.types";

interface SearchCardProps {
  user: SearchUser;
  onConnect: (userId: string) => void;
  onIgnore: (userId: string) => void;
  loading?: boolean;
}

const SearchCard = ({
  user,
  onConnect,
  onIgnore,
  loading = false,
}: SearchCardProps) => {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-xl transition hover:shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="avatar">
          <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
            <img
              src={user.photoURL ?? "https://placehold.co/150x150?text=Profile"}
              alt={user.userId.username}
            />
          </div>
        </div>

        <h2 className="mt-4 text-xl font-bold">{user.userId.username}</h2>

        <p className="mt-2 min-h-[60px] text-sm text-base-content/70">
          {user.about || "No bio added yet."}
        </p>

        <div className="mt-4 flex min-h-[32px] flex-wrap justify-center gap-2">
          {user.skills.length > 0 ? (
            user.skills.map((skill) => (
              <span key={skill} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-base-content/60">
              No skills added
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="btn btn-outline flex-1"
          disabled={loading}
          onClick={() => onIgnore(user.userId._id)}
        >
          Ignore
        </button>

        <button
          className="btn btn-primary flex-1"
          disabled={loading}
          onClick={() => onConnect(user.userId._id)}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Connect"
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchCard;

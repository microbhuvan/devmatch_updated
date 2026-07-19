import type { ReceivedRequest } from "../../types/request.types";

interface ReceivedRequestCardProps {
  request: ReceivedRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
}

const ReceivedRequestCard = ({
  request,
  onAccept,
  onReject,
  loading = false,
}: ReceivedRequestCardProps) => {
  const sender = request.fromUserId;
  const profile = sender.profile;

  return (
    <div className="flex flex-col gap-4 rounded-xl sm:flex-row sm:items-center sm:justify-between border border-base-300 bg-base-100 p-5 shadow">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={profile?.photoURL ?? "https://placehold.co/100x100?text=User"}
          alt={`Profile photo of ${sender.username}`}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{sender.username}</h2>

          <p className="truncate text-sm text-base-content/70">
            {profile?.about ?? "No bio available"}
          </p>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 gap-3 sm:w-auto">
        <button
          onClick={() => onReject(request._id)}
          disabled={loading}
          className="btn btn-outline btn-error flex-1 sm:flex-none"
          aria-label={`Reject connection request from ${sender.username}`}
        >
          {loading ? <span className="loading loading-spinner" /> : "Reject"}
        </button>

        <button
          onClick={() => onAccept(request._id)}
          disabled={loading}
          className="btn btn-primary flex-1 sm:flex-none"
          aria-label={`Accept connection request from ${sender.username}`}
        >
          {loading ? <span className="loading loading-spinner" /> : "Accept"}
        </button>
      </div>
    </div>
  );
};

export default ReceivedRequestCard;

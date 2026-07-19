import type { SentRequest } from "../../types/request.types";

interface SentRequestCardProps {
  request: SentRequest;
  onCancel(requestId: string): void;
  loading?: boolean;
}

const SentRequestCard = ({
  request,
  onCancel,
  loading = false,
}: SentRequestCardProps) => {
  const receiver = request.toUserId;
  const profile = receiver.profile;

  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img
            src={profile?.photoURL ?? "https://placehold.co/100x100?text=User"}
            alt={`Profile photo of ${receiver.username}`}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <h2 className="card-title">{receiver.username}</h2>

            <p className="text-sm text-base-content/70 truncate">
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

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <span className="badge badge-warning">Pending</span>
            <button
              className="btn btn-error btn-sm"
              onClick={() => onCancel(request._id)}
              disabled={loading}
              aria-label={`Cancel connection request to ${receiver.username}`}
            >
              {loading ? <span className="loading loading-spinner" /> : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentRequestCard;

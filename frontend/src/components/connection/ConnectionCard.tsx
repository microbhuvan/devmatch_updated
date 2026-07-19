import type { Connection } from "../../types/request.types";

interface ConnectionCardProps {
  connection: Connection;
  currentUserId: string;
}

const ConnectionCard = ({ connection, currentUserId }: ConnectionCardProps) => {
  const user =
    connection.fromUserId._id === currentUserId
      ? connection.toUserId
      : connection.fromUserId;

  const profile = user.profile;

  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <img
            src={profile?.photoURL ?? "https://placehold.co/100x100?text=User"}
            alt={`Profile photo of ${user.username}`}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="flex-1">
            <h2 className="card-title">{user.username}</h2>

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
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

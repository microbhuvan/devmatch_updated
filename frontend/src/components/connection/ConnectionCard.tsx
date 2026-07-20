import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import axios from "axios";

import type { Connection } from "../../types/request.types";
import { getOrCreateConversation } from "../../services/chat.service";
import { useToast } from "../../hooks/useToast";
import { removeConnection } from "../../services/request.service";

interface ConnectionCardProps {
  connection: Connection;
  currentUserId: string;
  onRemove: (connectionId: string) => void;
}

const ConnectionCard = ({
  connection,
  currentUserId,
  onRemove,
}: ConnectionCardProps) => {
  const navigate = useNavigate();
  const toast = useToast();

  const user =
    connection.fromUserId._id === currentUserId
      ? connection.toUserId
      : connection.fromUserId;

  const profile = user.profile;

  const handleChat = async () => {
    try {
      const data = await getOrCreateConversation(user._id);

      navigate(`/chats`, {
        state: {
          conversationId: data.conversation._id,
        },
      });
    } catch (err) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : "Unable to open chat";

      toast.error(message || "Unable to open chat");
    }
  };

  const handleRemove = async () => {
    try {
      await removeConnection(user._id);

      toast.success("Connection removed");

      onRemove(connection._id);
    } catch {
      toast.error("Unable to remove connection");
    }
  };

  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <img
            src={profile?.photoURL ?? "https://placehold.co/100x100?text=User"}
            alt={`Profile photo of ${user.username}`}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="flex-1 min-width-w-0">
            <h2 className="card-title truncate">{user.username}</h2>

            <p className="text-sm text-base-content/70 break-words">
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

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button onClick={handleChat} className="btn btn-primary btn-sm">
                <FaComments />
                Chat
              </button>

              <button
                onClick={handleRemove}
                className="btn btn-outline btn-error btn-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

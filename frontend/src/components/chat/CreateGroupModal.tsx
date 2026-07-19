import { useState } from "react";
import { createGroupConversation } from "../../services/chat.service";
import type { Conversation } from "../../types/chat.types";

interface Connection {
  _id: string;
  username: string;
}

interface Props {
  connections: Connection[];
  onClose: () => void;
  onGroupCreated: (conversation: Conversation) => void;
}

const CreateGroupModal = ({ connections, onClose, onGroupCreated }: Props) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      setError("Enter a group name and select at least two connections.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const conversation = await createGroupConversation(
        groupName,
        selectedUsers,
      );

      onGroupCreated(conversation);

      onClose();
    } catch {
      setError("Unable to create the group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="create-group-title">
      <div className="w-full max-w-md rounded-lg bg-base-100 p-5 shadow-xl">
        <h2 id="create-group-title" className="mb-4 text-xl font-bold">Create Group</h2>

        <input
          aria-label="Group name"
          className="input input-bordered mb-4 w-full"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

        <div className="mb-5 max-h-64 overflow-y-auto">
          {connections.map((user) => (
            <label key={user._id} className="flex items-center gap-3 py-2">
              <input
          aria-label="Group name"
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />

              {user.username}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

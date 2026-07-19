import type { Conversation } from "../../types/chat.types";
import { useSelector } from "react-redux";
import { FaComments } from "react-icons/fa";
import type { RootState } from "../../redux/store";

interface Props {
  conversations: Conversation[];
  selectedConversation?: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationSidebar = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="h-full overflow-y-auto bg-base-100">
      {conversations.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center text-base-content/60">
          <FaComments className="text-5xl" />
          <div>
            <h3 className="font-semibold">No Conversations Yet</h3>
            <p className="text-sm">
              Connections you chat with will appear here.
            </p>
          </div>
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedConversation?._id === conversation._id;

          const otherUser = conversation.participants.find(
            (participant) => participant._id !== user?.id,
          );

          const title = conversation.isGroup
            ? conversation.groupName ?? "Group"
            : otherUser?.username ?? "Unknown User";

          const image = conversation.isGroup
            ? `https://placehold.co/50x50/7e22ce/ffffff?text=${title.charAt(0).toUpperCase()}`
            : otherUser?.profile?.photoURL ??
              "https://placehold.co/50x50?text=U";

          return (
            <button
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`flex w-full cursor-pointer items-center gap-3 border-b p-4 text-left transition ${
                isSelected ? "bg-primary/10" : "hover:bg-base-200"
              }`}
            >
              <img
                src={image}
                alt={`Avatar for ${title}`}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{title}</h3>

                <p className="truncate text-sm text-base-content/60">
                  {conversation.lastMessage?.content ?? "Start chatting"}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default ConversationSidebar;

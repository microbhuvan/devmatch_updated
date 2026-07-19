import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { FaPlus } from "react-icons/fa";
import { socket } from "../socket/socket";

import ConversationSidebar from "../components/chat/ConversationSidebar";
import ConversationSidebarSkeleton from "../components/chat/ConversationSidebarSkeleton";
import CreateGroupModal from "../components/chat/CreateGroupModal";
import Chat from "./Chat";

import { getConversations } from "../services/chat.service";
import { getConnections } from "../services/request.service";
import { useToast } from "../hooks/useToast";

import type { Conversation } from "../types/chat.types";
import type { Connection } from "../types/connection.types";
import { useLocation } from "react-router-dom";

const Chats = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const location = useLocation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [conversationsData, connectionsData] = await Promise.all([
        getConversations(),
        getConnections(),
      ]);

      setConversations(conversationsData);
      setConnections(connectionsData.connections);

      const selectedId = location.state?.conversationId;

      if (selectedId) {
        setSelectedConversationId(selectedId);
      } else if (conversationsData.length > 0 && window.innerWidth >= 640) {
        setSelectedConversationId(conversationsData[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load chat data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleNewConversation = (newConversation: Conversation) => {
      setConversations((prev) => {
        // Avoid adding duplicates
        if (prev.some((c) => c._id === newConversation._id)) {
          return prev;
        }
        return [newConversation, ...prev];
      });
    };

    const handleUpdateConversation = (updatedConversation: Conversation) => {
      setConversations((prev) => {
        const otherConversations = prev.filter(
          (c) => c._id !== updatedConversation._id,
        );
        return [updatedConversation, ...otherConversations];
      });
    };

    socket.on("new_conversation", handleNewConversation);
    socket.on("update_conversation", handleUpdateConversation);

    return () => {
      socket.off("new_conversation", handleNewConversation);
      socket.off("update_conversation", handleUpdateConversation);
    };
  }, []);

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c._id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const groupUsers = connections.map((connection) =>
    connection.fromUserId._id === user?.id
      ? connection.toUserId
      : connection.fromUserId,
  );

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation._id);
  };

  const handleBack = () => {
    setSelectedConversationId(null);
  };

  const handleGroupCreated = (conversation: Conversation) => {
    // This is handled by the socket event now, but we can keep it for snappy UI for the creator
    setConversations((prev) => [conversation, ...prev]);
    setSelectedConversationId(conversation._id);
    setShowCreateGroup(false);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[32rem] overflow-hidden rounded-lg border border-base-300 bg-base-100">
      {/* Sidebar */}
      <aside
        className={`
          ${selectedConversationId ? "hidden" : "flex"} 
          w-full flex-col border-r border-base-300 bg-base-100 
          sm:w-80 sm:flex
        `}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold sm:text-2xl">Chats</h2>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="btn btn-primary btn-sm"
            aria-label="Create new group chat"
          >
            <FaPlus />
            <span className="hidden sm:inline ml-2">Group</span>
          </button>
        </div>
        {loading ? (
          <ConversationSidebarSkeleton />
        ) : (
          <ConversationSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </aside>

      {/* Chat Window */}
      <main
        className={`
          ${selectedConversationId ? "flex" : "hidden"} 
          flex-1 flex-col 
          sm:flex
        `}
      >
        {selectedConversation ? (
          <Chat
            key={selectedConversationId}
            conversation={selectedConversation}
            onBack={handleBack}
          />
        ) : (
          <div className="hidden h-full items-center justify-center p-4 text-center text-base-content/60 sm:flex">
            Select a conversation to start chatting
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          connections={groupUsers}
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default Chats;

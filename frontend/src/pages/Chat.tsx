import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

import { socket } from "../socket/socket";
import { getMessages, leaveGroupConversation } from "../services/chat.service";
import { useToast } from "../hooks/useToast";
import { MessageBubbleSkeleton } from "../components/chat/skeletons/MessageBubbleSkeleton";

import type { Conversation, Message } from "../types/chat.types";

interface ChatProps {
  conversation: Conversation;
  onBack: () => void;
}

const Chat = ({ conversation, onBack }: ChatProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conversationId = conversation._id;

  // Join and leave conversation rooms
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    setJoined(false);

    socket.emit(
      "join_conversation",
      { conversationId },
      (response: { success: any }) => {
        if (response.success) {
          setJoined(true);
        } else {
          toast.error("Unable to join conversation");
        }
      },
    );
  }, [conversationId]);
  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const data = await getMessages(conversationId);
        setMessages(data);
      } catch (err) {
        toast.error("Unable to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };
    loadMessages();
  }, [conversationId, toast]);

  // Listen for incoming messages and typing indicators
  useEffect(() => {
    const receiveMessage = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, message]);
    };

    const typingHandler = ({
      conversationId: cid,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (cid === conversationId && userId !== user?.id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000); // Hide after 3 seconds
      }
    };

    const stopTypingHandler = ({
      conversationId: cid,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (cid === conversationId && userId !== user?.id) {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    };

    socket.on("receive_message", receiveMessage);
    socket.on("user_typing", typingHandler);
    socket.on("user_stopped_typing", stopTypingHandler);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("user_typing", typingHandler);
      socket.off("user_stopped_typing", stopTypingHandler);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupConversation(conversationId);
      toast.success("You have left the group.");
      onBack(); // Go back to the list
    } catch {
      toast.error("Unable to leave the group. Please try again.");
    }
  };

  const handleSend = () => {
    if (!input.trim() || sending) return;
    if (!joined) return;

    setSending(true);

    socket.emit(
      "send_message",
      { conversationId, content: input.trim() },
      (response: { success: any; message: any }) => {
        console.log("SEND ACK:", response);

        setSending(false);

        if (response.success) {
          setInput("");
        } else {
          toast.error(response.message || "Message failed to send.");
        }
      },
    );
    socket.emit("typing_stop", { conversationId });
  };

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTyping = () => {
    socket.emit("typing_start", { conversationId });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId });
    }, 2000);
  };

  const otherUser = conversation.participants.find((p) => p._id !== user?.id);

  const chatTitle = conversation.isGroup
    ? (conversation.groupName ?? "Group")
    : (otherUser?.username ?? "Chat");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-base-300 p-3 sm:p-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="btn btn-ghost btn-circle sm:hidden"
            onClick={onBack}
          >
            <FaArrowLeft />
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold sm:text-xl">
              {chatTitle}
            </h2>
            {conversation.isGroup && (
              <p className="text-sm text-base-content/60">
                {conversation.participants.length} members
              </p>
            )}
          </div>
        </div>

        {conversation.isGroup && (
          <button onClick={handleLeaveGroup} className="btn btn-error btn-sm">
            Leave
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-base-200 p-3 sm:p-4">
        {loadingMessages ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <MessageBubbleSkeleton key={i} />
            ))}
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId._id === user?.id;
            return (
              <div
                key={message._id}
                className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              >
                {!isMine && (
                  <div className="chat-header text-xs opacity-50">
                    {message.senderId.username}
                  </div>
                )}
                <div
                  className={`chat-bubble max-w-xs sm:max-w-md md:max-w-lg wrap-break-word whitespace-pre-wrap ${
                    isMine ? "chat-bubble-primary" : ""
                  }`}
                >
                  {message.content}
                </div>
                <div className="chat-footer opacity-50">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble">
              <span className="loading loading-dots loading-md" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-base-300 p-3 sm:p-4 min-w-0">
        <input
          type="text"
          className="input input-bordered flex-1 min-w-0"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            handleTyping();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="btn btn-primary"
          aria-label="Send message"
        >
          {sending ? (
            <span className="loading loading-spinner" />
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;

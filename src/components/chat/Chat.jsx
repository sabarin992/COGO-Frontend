import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  ShieldCheck,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const { conversationId: paramConversationId } = useParams();
  const conversationId = paramConversationId ? Number(paramConversationId) : null;

  // Load current logged-in user
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await api.get("/user/profile");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // Load previous messages
  useEffect(() => {
    if (!conversationId || Number.isNaN(conversationId)) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(
          `/chat/conversations/${conversationId}/messages`
        );

        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // WebSocket connection
  useEffect(() => {
    if (!conversationId || Number.isNaN(conversationId)) return;

    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
    const wsBase = apiBase.replace(/^http/, "ws");
    const socket = new WebSocket(
      `${wsBase}/chat/ws/chat/${conversationId}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setMessages((previousMessages) => [
          ...previousMessages,
          data,
        ]);
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      setIsSending(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [conversationId]);


  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    const trimmedMessage = message.trim();
    const socket = socketRef.current;

    if (!trimmedMessage || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        message: trimmedMessage,
      })
    );

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="text-sm">Loading your conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-w-0 w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-[calc(100dvh-190px)] min-h-[420px] max-h-[850px]">

      {/* Conversation header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
            <UserRound size={22} />

            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                isConnected ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg">
              Ride Conversation
            </h1>

            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
              {isConnected ? (
                <>
                  <Wifi size={13} className="text-emerald-600" />
                  <span className="text-emerald-700">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff size={13} />
                  <span>Disconnected</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <ShieldCheck size={15} />
          Private chat
        </div>
      </header>

      {/* Messages area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F8F9FA] px-3 py-5 sm:px-6">
        <div className="mb-5 flex justify-center">
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-500 shadow-sm">
            Messages
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-100">
              <MessageCircle size={30} strokeWidth={1.5} />
            </div>

            <h2 className="text-base font-bold text-gray-900">
              Start the conversation
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
              Have a question about your ride? Send a message to get the conversation started.
            </p>
          </div>
        ) : (
          <div className="mt-auto space-y-5">
            {messages.map((msg, index) => {
              const isOwnMessage =
                Number(msg.sender_id) === Number(currentUser.id);

              const messageTime = msg.created_at
                ? new Date(msg.created_at)
                : null;

              const validMessageTime =
                messageTime &&
                !Number.isNaN(messageTime.getTime());

              return (
                <div
                  key={msg.id ?? `${msg.sender_id}-${index}`}
                  className={`flex min-w-0 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[75%] ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {!isOwnMessage && (
                      <span className="mb-1.5 ml-1 text-[11px] font-semibold text-gray-500">
                        Other participant
                      </span>
                    )}

                    <div
                      className={`min-w-0 rounded-2xl px-4 py-3 shadow-sm ${
                        isOwnMessage
                          ? "rounded-br-md bg-black text-white"
                          : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {msg.message}
                      </p>

                      {validMessageTime && (
                        <p
                          className={`mt-1.5 text-right text-[10px] ${
                            isOwnMessage
                              ? "text-gray-300"
                              : "text-gray-400"
                          }`}
                        >
                          {messageTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message composer */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="shrink-0 border-t border-gray-100 bg-white p-3 sm:p-4"
      >
        <div className="flex min-w-0 items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-gray-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100">
          <textarea
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isConnected
                ? "Write your message..."
                : "Waiting for connection..."
            }
            disabled={!isConnected}
            aria-label="Type a message"
            className="max-h-28 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!isConnected || !message.trim() || isSending}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm transition hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="mt-2 px-1 text-[10px] text-gray-400">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </section>
  );
}

export default Chat;
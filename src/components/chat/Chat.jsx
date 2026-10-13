import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Temporary conversation ID
  // We will make this dynamic later.
  const { conversationId: paramsConversationId } = useParams();
  const conversationId = Number(paramsConversationId);

  // --------------------------------
  // Load current logged-in user
  // --------------------------------
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/profile",
          {
            withCredentials: true,
          },
        );

        console.log("Current user:", response.data);

        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // --------------------------------
  // Load previous messages
  // --------------------------------
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/chat/conversations/${conversationId}/messages`,
          {
            withCredentials: true,
          },
        );

        console.log("Previous messages:", response.data);

        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // --------------------------------
  // WebSocket connection
  // --------------------------------
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/api/v1/chat/ws/chat/${conversationId}`,
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");

      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Received message:", data);

      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");

      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);

      setIsConnected(false);
    };

    // Cleanup when component unmounts
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  // --------------------------------
  // Auto scroll to latest message
  // --------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // --------------------------------
  // Send message
  // --------------------------------
  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        message: message.trim(),
      }),
    );

    setMessage("");
  };

  // --------------------------------
  // Send message when Enter is pressed
  // --------------------------------
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // --------------------------------
  // Loading current user
  // --------------------------------
  if (!currentUser) {
    return <p>Loading user...</p>;
  }

  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Chat</h2>

        <span>{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</span>
      </div>

      {/* Messages */}
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          padding: "15px",
        }}
      >
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === currentUser.id;
      
            

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor: isOwnMessage ? "#DCF8C6" : "#f1f1f1",
                  }}
                >
                  {/* Sender */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "3px",
                    }}
                  >
                    {isOwnMessage ? "You" : `${msg.sender_name}`}
                  </div>

                  {/* Message */}
                  <div>{msg.message}</div>

                  {/* Time */}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!isConnected || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;

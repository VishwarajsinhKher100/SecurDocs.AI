import React, { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setInputQuery("");
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isStreaming) return;

    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setIsStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          role: user.role,
          query: textToSend,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunk;
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Error retrieving response.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onSelectQuestion={(q) => handleSendQuery(q)}
        isStreaming={isStreaming}
      />
      <ChatArea
        messages={messages}
        inputQuery={inputQuery}
        setInputQuery={setInputQuery}
        onSendQuery={handleSendQuery}
        isStreaming={isStreaming}
      />
    </div>
  );
}
import React, { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ChatArea({
  messages,
  inputQuery,
  setInputQuery,
  onSendQuery,
  isStreaming,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendQuery();
  };

  return (
    <main className="chat-area">
      <div className="top-bar">
        <button className="top-bar-btn">Deploy</button>
        <button className="top-bar-btn dots-icon">⋮</button>
      </div>

      {messages.length === 0 ? (
        <div className="hero-container">
          <h1 className="hero-title">Customer Care Assistant</h1>
          <p className="hero-subtitle">
            Ask me anything about your mobile service — connectivity, billing,
            SIM, roaming, and more.
          </p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((m, i) => (
            <div key={i} className={`message-wrapper ${m.role}`}>
              <div className="message-bubble">
                <div className="message-content">{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            placeholder="Describe your issue..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isStreaming}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming}
            className="send-btn"
          >
            <ArrowUp size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}
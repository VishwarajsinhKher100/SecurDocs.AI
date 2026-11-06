import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

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
    <main className="flex-1 flex flex-col justify-between p-8 relative overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
            Customer Care Assistant
          </h1>
          <p className="text-gray-400 text-base max-w-xl">
            Ask me anything about your mobile service — connectivity, billing,
            SIM, roaming, and more.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-[#1f232c] border border-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Box */}
      <div className="w-full max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Describe your issue..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isStreaming}
            className="w-full py-4 pl-5 pr-14 bg-[#21242e] border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-xl transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming}
            className="absolute right-3 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}

import React from "react";
import { Antenna, LogOut } from "lucide-react";

const SAMPLE_QUESTIONS = [
  "Why is my mobile internet so slow?",
  "My calls keep dropping — what should I do?",
  "How do I activate international roaming?",
  "Why is my bill higher than usual this month?",
];

export default function Sidebar({
  user,
  onLogout,
  onSelectQuestion,
  isStreaming,
}) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <Antenna className="sidebar-icon" />
          <h1 className="sidebar-title">Telecom Support</h1>
        </div>
        <p className="sidebar-subtitle">Powered by RAG • Qwen3-32B on Groq</p>

        <div className="sidebar-divider" />

        <div>
          <h3 className="section-title">Sample questions</h3>
          <p className="section-subtitle">Click one to send it instantly.</p>
          <div className="questions-list">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuestion(q)}
                disabled={isStreaming}
                className="sample-question-btn"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div>
          <p className="user-name">{user.username}</p>
          <p className="user-role">{user.role}</p>
        </div>
        <button onClick={onLogout} className="logout-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}
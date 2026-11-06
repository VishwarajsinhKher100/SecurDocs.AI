import React from "react";
import { Radio, LogOut } from "lucide-react";

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
    <aside className="w-80 bg-[#1a1d24] border-r border-gray-800 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Radio className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Telecom Support
          </h1>
        </div>
        <p className="text-xs text-gray-400 mb-8">
          Powered by RAG • Qwen3-32B on Groq
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Sample questions
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Click one to send it instantly.
          </p>
          <div className="space-y-2.5">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuestion(q)}
                disabled={isStreaming}
                className="w-full text-left p-3 text-xs bg-[#222630] hover:bg-[#2a2e3b] border border-gray-700/50 rounded-lg text-gray-300 transition duration-150 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{user.username}</p>
          <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">
            {user.role}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

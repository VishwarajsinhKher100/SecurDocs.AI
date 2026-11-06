import React, { useState } from "react";
import { Lock } from "lucide-react";

export default function Login({ onLoginSuccess }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      onLoginSuccess(data);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#13151b] flex items-center justify-center p-4 text-gray-200">
      <div className="w-full max-w-md bg-[#1c1f26] border border-gray-800 rounded-xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-600/20 rounded-full text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          ContextGuard Login
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your credentials to access authorized RAG documents.
        </p>

        {loginError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-[#13151b] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-[#13151b] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

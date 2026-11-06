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
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon-wrap">
          <div className="login-icon-bg">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="login-title">ContextGuard Login</h2>
        <p className="login-subtitle">
          Enter your credentials to access authorized RAG documents.
        </p>

        {loginError && <div className="login-error">{loginError}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-submit-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
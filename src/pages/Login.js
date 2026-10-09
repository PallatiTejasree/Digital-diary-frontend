import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import API_BASE from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Password reset failed");
        return;
      }
      setPassword("");
      setNewPassword("");
      setResetMode(false);
      setError("Password reset successfully. You can now log in.");
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  const handleLogin = async () => {
    setError("");

    try {
      console.log("Email:", email);
console.log("Password:", password);
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === "string") {
          setError(data.detail);
        } else if (Array.isArray(data.detail)) {
          setError(data.detail[0]?.msg || "Login failed");
        } else {
          setError("Login failed");
        }
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.access_token);

      // Save email
      localStorage.setItem("email", email);

      // Navigate to home
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>🔐 Unlock Memories</h2>

        <p className="subtitle">
          Only your heart knows the password.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!resetMode ? (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <input
            type="password"
            placeholder="New password (8+ characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        )}

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button onClick={resetMode ? handleResetPassword : handleLogin}>
          {resetMode ? "Save New Password" : "Open Diary ✨"}
        </button>
        <button type="button" onClick={() => { setResetMode(!resetMode); setError(""); }}>
          {resetMode ? "Back to Login" : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default Login;

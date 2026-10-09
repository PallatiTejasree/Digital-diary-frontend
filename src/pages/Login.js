import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import API_BASE from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signupMode, setSignupMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pin, setPin] = useState("");
  const [recoveredUser, setRecoveredUser] = useState(null);
  const [forgotEmailMode, setForgotEmailMode] = useState(false);

  const handleForgotEmail = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/recover-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "PIN not found");
        return;
      }
      setRecoveredUser(data);
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    try {
      if (!recoveredUser) {
        const response = await fetch(`${API_BASE}/recover-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "PIN not found");
          return;
        }
        setRecoveredUser(data);
        return;
      }
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveredUser.email, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Password reset failed");
        return;
      }
      setPassword("");
      setNewPassword("");
      setResetMode(false);
      setRecoveredUser(null);
      setPin("");
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

  const handleSignup = async () => {
    setError("");
    if (!name.trim() || password.length < 8 || pin.length < 4) {
      setError("Enter your name, an 8+ character password, and a 4+ digit PIN.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password, pin }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Sign up failed");
        return;
      }

      setSignupMode(false);
      setName("");
      setPassword("");
      setPin("");
      setError("Account created successfully. You can now log in.");
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>🔐 Unlock Memories</h2>

        <div className="authTabs" role="tablist" aria-label="Account access">
          <button
            type="button"
            className={!signupMode && !resetMode ? "authTab active" : "authTab"}
            onClick={() => { setSignupMode(false); setResetMode(false); setError(""); }}
          >
            Login
          </button>
          <button
            type="button"
            className={signupMode ? "authTab active" : "authTab"}
            onClick={() => { setSignupMode(true); setResetMode(false); setError(""); }}
          >
            Sign up
          </button>
        </div>

        <p className="subtitle">
          {signupMode ? "Create a safe place for your memories." : "Only your heart knows the password."}
        </p>

        {signupMode && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {signupMode && (
          <input
            type="password"
            inputMode="numeric"
            placeholder="Recovery PIN (4+ digits)"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        )}

        {!resetMode && !forgotEmailMode && <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />}

        {forgotEmailMode && !recoveredUser && (
          <input
            type="password"
            inputMode="numeric"
            placeholder="Recovery PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        )}

        {forgotEmailMode && recoveredUser && (
          <p className="recoveredUser">Your email: {recoveredUser.email}</p>
        )}

        {resetMode && !recoveredUser && (
          <input
            type="password"
            inputMode="numeric"
            placeholder="Recovery PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        )}

        {resetMode && recoveredUser && <p className="recoveredUser">Account found: {recoveredUser.name}</p>}

        {forgotEmailMode ? null : resetMode && recoveredUser ? (
          <input type="password" placeholder="New password (8+ characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        ) : !resetMode ? (
          <input
            type="password"
            placeholder={signupMode ? "Password (8+ characters)" : "Password"}
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

        <button onClick={forgotEmailMode ? handleForgotEmail : (resetMode ? handleResetPassword : (signupMode ? handleSignup : handleLogin))}>
          {forgotEmailMode ? "Find My Email" : (resetMode ? "Save New Password" : (signupMode ? "Create Account ✨" : "Open Diary ✨"))}
        </button>
        <button className="resetButton" type="button" onClick={() => { setForgotEmailMode(!forgotEmailMode); setResetMode(false); setSignupMode(false); setRecoveredUser(null); setPin(""); setError(""); }}>
          {forgotEmailMode ? "Back to Login" : "Forgot Email?"}
        </button>
        <button className="resetButton" type="button" onClick={() => { setResetMode(!resetMode); setForgotEmailMode(false); setSignupMode(false); setRecoveredUser(null); setPin(""); setError(""); }}>
          {resetMode ? "Back to Login" : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default Login;

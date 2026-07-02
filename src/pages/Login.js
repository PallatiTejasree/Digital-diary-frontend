import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button onClick={handleLogin}>
          Open Diary ✨
        </button>
      </div>
    </div>
  );
}

export default Login;
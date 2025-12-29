import { useState } from "react";
import { loginAdmin } from "../api/adminApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const data = await loginAdmin(username, password);

    if (data?.token) {
      localStorage.setItem("admin_token", data.token);
      window.location.href = "/";
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div style={{
      maxWidth: 360,
      margin: "120px auto",
      background: "#fff",
      padding: 24,
      borderRadius: 8
    }}>
      <h2>Mascot Admin</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}

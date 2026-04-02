import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ STEP 2 FIX: Save both Token and Role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Optional: Success alert so the recruiter knows the role was identified
      alert(`Login successful as ${res.data.role}`);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials. Please use the Demo buttons below.");
    }
  };

  const quickFill = (userEmail) => {
    setEmail(userEmail);
    setPassword("123");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Zorvyn Finance Portal</h1>
      <div
        style={{
          background: "#f4f4f4",
          padding: "30px",
          display: "inline-block",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
          />
          <br />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", width: "250px", marginBottom: "20px" }}
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "10px 40px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <hr style={{ margin: "20px 0" }} />
        <p>
          <strong>Quick Access for Evaluation:</strong>
        </p>
        <button
          onClick={() => quickFill("admin@test.com")}
          style={{ marginRight: "10px", padding: "8px", cursor: "pointer" }}
        >
          Fill Admin
        </button>
        <button
          onClick={() => quickFill("viewer@test.com")}
          style={{ padding: "8px", cursor: "pointer" }}
        >
          Fill Viewer
        </button>
      </div>
    </div>
  );
};

export default Login;

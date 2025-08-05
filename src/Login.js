import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin@123";

  const validateRegister = () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("⚠️ Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      setError("⚠️ Email already registered");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    alert("✅ Registered successfully. Please login.");

    // Clear fields and switch to login tab
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setIsLogin(true);
  };

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("⚠️ Email and password are required");
      return;
    }

    // Admin login
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("authenticatedUser", JSON.stringify({ name: "Admin", email }));
      localStorage.setItem("isAdmin", "true");
      alert("👑 Welcome Admin");
      navigate("/admin");
      return;
    }

    // Normal user login
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError("❌ Invalid credentials");
      return;
    }

    localStorage.setItem("authenticatedUser", JSON.stringify(user));
    localStorage.setItem("isAdmin", "false");
    alert("✅ Logged in successfully");
    navigate("/home");
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert("📧 Enter your registered email to reset password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      alert("❌ Email not found.");
      return;
    }

    alert(`📬 Your password is: ${user.password}`);
  };

  return (
    <div className="page-container">
      <h1 className="brand-title">
        ✨Career<span className="highlight">Crafter</span>
      </h1>

      <div className="auth-container">
        <div className="form-box">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="👤 Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="📩 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="🔑 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <input
              type={showPassword ? "text" : "password"}
              placeholder="🔁 Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <div style={{ marginTop: "8px", textAlign: "left" }}>
            <input
              type="checkbox"
              onChange={(e) => setShowPassword(e.target.checked)}
              checked={showPassword}
            />
            <label style={{ marginLeft: "6px" }}>Show Password</label>
          </div>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <button onClick={!isLogin ? validateRegister : handleLogin}>
            {isLogin ? "Login" : "Register"}
          </button>

          {isLogin && (
            <p
              onClick={handleForgotPassword}
              style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
            >
              Forgot Password?
            </p>
          )}

          <p onClick={() => setIsLogin(!isLogin)} style={{ marginTop: "10px", cursor: "pointer" }}>
            {isLogin ? (
              <>Don't have an account? <span style={{ color: "blue" }}>Register</span></>
            ) : (
              <>Already have an account? <span style={{ color: "#C71585" }}>Login</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

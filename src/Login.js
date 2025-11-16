 // src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./Login.css";
import axios from "axios";

function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  const conditions = [
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    { regex: /[@$!%*?&]/, text: "One special character" },
    { regex: /^.{8}$/, text: "Exactly 8 characters" },
  ];

  // ================== REGISTER ==================
 const validateRegister = async () => {
  setError("");

  if (!name || !email || !password || !confirmPassword) {
    setError("All fields are required.");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    await axios.post(`${API_BASE}/register`, { name, email, password });

    // Auto-login after register
    const loginRes = await axios.post(`${API_BASE}/login`, { email, password });

    const token = loginRes.data.token;
    const role = loginRes.data.role;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("authenticatedUser", "true");
    localStorage.setItem("isAdmin", role === "admin" ? "true" : "false");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    alert("🎉 Registration successful!");

    // NEW USERS ALWAYS GO TO HOME
    navigate("/home");

  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
  }
};


  // ================== LOGIN ==================
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });

      const token = res.data.token;
      const role = res.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("authenticatedUser", "true");
      localStorage.setItem("isAdmin", role === "admin" ? "true" : "false");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (role === "admin") {
        alert("👑 Welcome Admin");
        navigate("/admin");
      } else {
        alert("✅ Login successful!");
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  // ================== PASSWORD RESET ==================
  const handleForgotPassword = async () => {
    setError("");

    if (!newPassword) {
      setError("Enter a new password.");
      return;
    }
    if (!conditions.every(({ regex }) => regex.test(newPassword))) {
      setError("New password must meet all requirements.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/reset-password`, { email, newPassword });

      alert("🙂 Password reset successful!");
      setForgotPassword(false);
      setNewPassword("");
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    }
  };

  // ================== TOGGLE LOGIN / REGISTER ==================
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForgotPassword(false);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setNewPassword("");
    setShowTooltip(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
  };

  return (
    <div className="page-container">
      <h1 className="brand-title">✨Career<span className="highlight">Crafter</span></h1>

      <div className="auth-container">
        <div className={`form-box ${isLogin ? "login" : "register"}`}>

          <h2>{forgotPassword ? "Reset Password" : isLogin ? "Login" : "Register"}</h2>

          {/* Email */}
          {!forgotPassword && (
            <input type="text" placeholder="📩 Enter your email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          )}

          {/* ================= RESET PASSWORD ================= */}
          {forgotPassword ? (
            <>
              <div className="password-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="🔑 Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                />
                <i
                  className={`bi ${showNewPassword ? "bi-eye" : "bi-eye-slash"}`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                ></i>

                {showTooltip && (
                  <div className="tooltip">
                    {conditions.map(({ regex, text }, i) => (
                      <p key={i} className={regex.test(newPassword) ? "valid" : "invalid"}>
                        {regex.test(newPassword) ? "✔" : "✖"} {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button onClick={handleForgotPassword}>Reset Password</button>

              <p onClick={() => { setForgotPassword(false); setError(""); }}>
                Back to <span style={{ color: "blue" }}>Login</span>
              </p>
            </>
          ) : (
            <>
              {/* ================= PASSWORD INPUT ================= */}
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="🔑 Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => !isLogin && setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                />
                <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>

                {!isLogin && showTooltip && (
                  <div className="tooltip">
                    {conditions.map(({ regex, text }, i) => (
                      <p key={i} className={regex.test(password) ? "valid" : "invalid"}>
                        {regex.test(password) ? "✔" : "✖"} {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= REGISTER FIELDS ================= */}
              {!isLogin && (
                <>
                  <input type="text" placeholder="👤 Enter your name"
                    value={name} onChange={(e) => setName(e.target.value)} />

                  <div className="password-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="🔑 Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i
                      className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>
                </>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* LOGIN / REGISTER BUTTON */}
              <button onClick={!isLogin ? validateRegister : handleLogin}>
                {isLogin ? "Login" : "Register"}
              </button>

              {/* TOGGLE */}
              <p onClick={toggleForm}>
                {isLogin ? (
                  <>Don't have an account? <span style={{ color: "blue" }}>Register</span></>
                ) : (
                  <>Already have an account? <span style={{ color: "#C71585" }}>Login</span></>
                )}
              </p>

              {/* FORGOT PASSWORD */}
              {isLogin && (
                <p onClick={() => setForgotPassword(true)} style={{ color: "red" }}>
                  Forgot Password?
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

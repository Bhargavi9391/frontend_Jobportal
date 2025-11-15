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
  const [isAdmin, setIsAdmin] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();
 const API_BASE = "https://backend-jobportal-xoym.onrender.com";




  const conditions = [
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    { regex: /[@$!%*?&]/, text: "One special character" },
    { regex: /^.{8}$/, text: "Exactly 8 characters" },
  ];

  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin@123";

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
    const res = await axios.post(`${API_BASE}/register`, {
      name,
      email,
      password,
    });

    alert("Registration successful! User saved in MongoDB.");

    // Optional: store session
    localStorage.setItem("authenticatedUser", JSON.stringify(res.data.user));

    toggleForm(); // Switch to login form

  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
  }
};


  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Enter email and password.");
    return;
  }

  // Admin login (local check)
  if (email === adminEmail && password === adminPassword) {
    localStorage.setItem("authenticatedUser", JSON.stringify({ name: "Admin", email }));
    localStorage.setItem("isAdmin", "true");
    alert("👑 Welcome Admin");
    navigate("/admin");
    return;
  }

  // Normal user login using backend
  try {
    const res = await axios.post(`${API_BASE}/login`, {
      email,
      password
    });

    const user = res.data.user;

    // Store session
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
    localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false");

    alert("✅ Logged in successfully!");

    navigate("/home");

  } catch (err) {
    setError(err.response?.data?.message || "Login failed.");
  }
};


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
    const res = await axios.post(`${API_BASE}/reset-password`, {
      email,
      newPassword
    });

    alert("🙂 Password reset successful! Please login with your new password.");
    setForgotPassword(false);
    setNewPassword("");
    setIsLogin(true);

  } catch (err) {
    setError(err.response?.data?.message || "Password reset failed.");
  }
};

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
    <h1 className="brand-title">
      ✨Career<span className="highlight">Crafter</span>
    </h1>
    <div className="auth-container">
      <div className={`form-box ${isLogin ? "login" : "register"}`}>
        <h2>{forgotPassword ? "Reset Password" : isLogin ? "Login" : "Register"}</h2>

        {!forgotPassword && (
          <input
            type="text"
            placeholder="📩Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {forgotPassword ? (
          <>
            <div className="password-container">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="🔑Enter new password"
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
                  {conditions.map(({ regex, text }, index) => (
                    <p key={index} className={regex.test(newPassword) ? "valid" : "invalid"}>
                      {regex.test(newPassword) ? "✔" : "✖"} {text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleForgotPassword}>Reset Password</button>
            <p
              style={{ color: "black" }}
              onClick={() => {
                setForgotPassword(false);
                setError("");
                setNewPassword("");
              }}
            >
              Back to <span style={{ color: "blue" }}>Login</span>
            </p>
          </>
        ) : (
          <>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="🔑Enter your password"
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
                  {conditions.map(({ regex, text }, index) => (
                    <p key={index} className={regex.test(password) ? "valid" : "invalid"}>
                      {regex.test(password) ? "✔" : "✖"} {text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="👤Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="🔑Confirm Password"
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

            <button onClick={!isLogin ? validateRegister : handleLogin}>
              {isLogin ? "Login" : "Register"}
            </button>

            <p onClick={toggleForm}>
              {isLogin ? (
                <>
                  Don't have an account? <span style={{ color: "blue" }}>Register</span>
                </>
              ) : (
                <>
                  Already have an account? <span style={{ color: "#C71585" }}>Login</span>
                </>
              )}
            </p>

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

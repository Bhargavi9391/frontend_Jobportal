import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
  const navigate = useNavigate();

  const conditions = [
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    { regex: /[@$!%*?&]/, text: "One special character" },
    { regex: /^.{8}$/, text: "Exactly 8 characters" },
  ];

  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin@123";

  const validateRegister = () => {
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (!email || !name || !password || !confirmPassword) {
      setError("⚠️ All fields are required!");
      return;
    }
    if (registeredUsers.some((user) => user.email === email)) {
      setError("👤Email already exists!");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("🤷‍♂️Email must end with @gmail.com");
      return;
    }

    if (!conditions.every(({ regex }) => regex.test(password))) {
      setError("Password must meet all requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
   
    registeredUsers.push({ email, password });
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    setError("");
    alert("🙂Registration Successful!");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setIsLogin(true);
    localStorage.setItem("authenticatedUser", JSON.stringify({ name, email }));



  };

  const validateLogin = () => {
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  
    if (!email || !password) {
      setError("✍️ Please enter email and password");
      return;
    }
  
    const user = registeredUsers.find((user) => user.email === email);
  
    if (user) {
      localStorage.setItem("authenticatedUser", JSON.stringify({ name: user.name, email: user.email }));
    }
  
    
    if (email === adminEmail && password === adminPassword) {
      alert("👑 Welcome, Admin!");
      setIsAdmin(true);
      localStorage.setItem("authenticatedUser", JSON.stringify({ name: "Admin", email: adminEmail }));
      localStorage.setItem("isAdmin", "true");
  
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
      return;
    }
  
 
    if (!user) {
      setError("🤷‍♂️ No user available. Please create an account.");
      setEmail("");
      setPassword("");
      return;
    }
  
    
    if (user.password !== password) {
      setError("❌ Email or password is incorrect");
      return;
    }
  
 
    setError("");
    localStorage.setItem("authenticatedUser", JSON.stringify({ name: user.name, email: user.email }));
    localStorage.setItem("isAdmin", "false");
    setEmail("");
    setPassword("");
    alert("👍 Login Successful!");
  
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };
  
  
  
  const handleForgotPassword = () => {
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let userIndex = registeredUsers.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      setError("Email not found. Please register first.");
      return;
    }

    if (!conditions.every(({ regex }) => regex.test(newPassword))) {
      setError("New password must meet all requirements.");
      return;
    }

    registeredUsers[userIndex].password = newPassword;
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    alert("🙂Password reset successful! Please login with your new password.");
    setForgotPassword(false);
    setNewPassword("");
    setError("");
    setIsLogin(true);
  };

  



  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
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
            <p style={{ color: "black" }} onClick={() => setForgotPassword(false)}>
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

            <button onClick={!isLogin ? validateRegister : validateLogin}>
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

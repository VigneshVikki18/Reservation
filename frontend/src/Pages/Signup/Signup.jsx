import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Signup.module.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [typeofuser, setTypeofuser] = useState("user");  // Default to 'user'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch("https://reservation-nbg6.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, typeofuser }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and typeofuser in cookies and local storage
        Cookies.set("token", data.token, { expires: 7 });
        Cookies.set("typeofuser", data.typeofuser, { expires: 7 });
        localStorage.setItem("token", data.token);
        localStorage.setItem("typeofuser", data.typeofuser);

        navigate("/");  // Redirect after signup
      } else {
        setError(data.message || "An error occurred during signup");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
<<<<<<< HEAD
=======
      <h2 className={styles.title}>Welcome to Signup</h2>
>>>>>>> 0891b26e258078b2a79cbc3de73f65ea13edef4e
      <h2 className={styles.title}>Sign Up</h2>
      {error && <p className={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Password Field */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Confirm Password */}
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Radio Button for Admin/User */}
        <div className={styles.formGroup}>
          <label className={styles.label}>User Type:</label>
          <div>
            <label>
              <input
                type="radio"
                value="admin"
                checked={typeofuser === "admin"}
                onChange={(e) => setTypeofuser(e.target.value)}
              />
              Admin
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="user"
                checked={typeofuser === "user"}
                onChange={(e) => setTypeofuser(e.target.value)}
              />
              User
            </label>
          </div>
        </div>

        <button type="submit" className={styles.button}>Sign Up</button>
      </form>

      <Link to="/login" className={styles.link}>Already have an account? Login</Link>
    </div>
  );
};

export default Signup;

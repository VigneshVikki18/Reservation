import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Login.module.css";

import ReviewsAndSearch from '../../components/ReviewsAndSearch'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typeofuser, setTypeofuser] = useState("user");  // Default to 'user'
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [islogin, setIslogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, typeofuser }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and typeofuser in cookies and local storage
        Cookies.set("token", data.token, { expires: 7 });  // 7 days expiry
        Cookies.set("typeofuser", data.typeofuser, { expires: 7 });
        localStorage.setItem("token", data.token);
        localStorage.setItem("typeofuser", data.typeofuser);

        setIslogin(true);
        navigate("/");  // Redirect to homepage or dashboard
      } else {
        setError(data.message || "An error occurred during login");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <> 
      {!islogin ? (
        <div className={styles.container}>
          <h2 className={styles.title}>Welcome to Restaurant Reservation</h2>
          <h2 className={styles.title}>Login</h2>
          
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

            <button type="submit" className={styles.button}>Login</button>
          </form>

          <Link to="/signup" className={styles.link}>
            Don't have an account? Sign up
          </Link>
        </div>
      ) : (
        <> 
          {/* Display components after successful login */}
         <ReviewsAndSearch/>
        </>
      )}
    </>
  );
};

export default Login;

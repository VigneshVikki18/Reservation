import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

import About from '../../components/About'
import Footer from '../../components/Footer'
import HeroSection from "../../components/HeroSection"
import Qualities from "../../components/Qualities"
import Menu from "../../components/Menu"
import WhoAreWe from "../../components/WhoAreWe"
import Team from "../../components/Team"
import Reservation from "../../components/Reservation"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [islogin, setIslogin] = useState(false) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("https://reservation-nbg6.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setIslogin(true)
      } else {
        setError(data.message || "An error occurred during login")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <> 
      {!islogin ? (
        <div className={styles.container}>
          <h2 className={styles.title}>Welcome to Meet & Meats</h2>
          <h2 className={styles.title}>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
          <Link to="/signup" className={styles.link}>
            Don't have an account? Sign up
          </Link>
        </div>
      ) : (
        <> 
        
        <HeroSection/>
          <About />
          <Qualities/>
          <Menu/>
          <WhoAreWe/>
          <Team/>
          <Reservation/>
          <Footer />
        </>
      )}
    </>
  )
}

export default Login

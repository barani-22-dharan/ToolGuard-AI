import React, { useState } from "react";
import axios from "axios";

import {
  FaTools,
  FaLock,
  FaUser,
  FaBrain,
  FaChartLine,
  FaCogs,
  FaShieldAlt,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

import "./Login.css";


function Login({ onLoginSuccess }) {

  const [showSignup, setShowSignup] = useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();


    if (!username.trim() || !password.trim()) {

      alert(
        "Please enter username and password."
      );

      return;

    }


    try {

      setLoading(true);


      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        {
          username: username.trim(),
          password: password
        }
      );


      alert(response.data.message);


      console.log(
        "Logged in user:",
        response.data
      );


      // Save logged-in user
      localStorage.setItem(
        "toolguardUser",
        JSON.stringify(response.data)
      );


      // Open Dashboard
      onLoginSuccess();


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      const message =
        error.response?.data?.detail ||
        "Login failed. Please try again.";


      alert(message);


    } finally {

      setLoading(false);

    }

  };


  // Show Signup page
  if (showSignup) {

    return (

      <Signup
        onBackToLogin={() =>
          setShowSignup(false)
        }
      />

    );

  }


  // Show Forgot Password page
  if (showForgotPassword) {

    return (

      <ForgotPassword
        onBackToLogin={() =>
          setShowForgotPassword(false)
        }
      />

    );

  }


  return (

    <div className="login-page">


      {/* ================= LEFT SECTION ================= */}

      <section className="login-left">

        <div className="left-content">


          <div className="brand-logo">

            <FaTools />

          </div>


          <h1>

            ToolGuard <span>AI</span>

          </h1>


          <p className="brand-tagline">

            Intelligent Tool Wear Monitoring
            <br />

            & Predictive Maintenance

          </p>


          {/* Features */}

          <div className="feature-list">


            {/* Feature 1 */}

            <div className="feature-item">

              <div className="feature-icon">

                <FaBrain />

              </div>


              <div>

                <h3>
                  AI Prediction
                </h3>

                <p>
                  Predict tool wear using machine
                  and sensor data.
                </p>

              </div>

            </div>


            {/* Feature 2 */}

            <div className="feature-item">

              <div className="feature-icon">

                <FaChartLine />

              </div>


              <div>

                <h3>
                  Real-Time Monitoring
                </h3>

                <p>
                  Monitor machine and tool
                  performance continuously.
                </p>

              </div>

            </div>


            {/* Feature 3 */}

            <div className="feature-item">

              <div className="feature-icon">

                <FaCogs />

              </div>


              <div>

                <h3>
                  Predictive Maintenance
                </h3>

                <p>
                  Identify maintenance requirements
                  before tool failure.
                </p>

              </div>

            </div>


          </div>


          {/* PLM Badge */}

          <div className="plm-badge">

            <FaShieldAlt />

            <span>
              PLM Integrated Tool Lifecycle Management
            </span>

          </div>


        </div>


        {/* Background Shapes */}

        <div className="circle circle-one"></div>

        <div className="circle circle-two"></div>

        <div className="grid-pattern"></div>


      </section>



      {/* ================= RIGHT SECTION ================= */}

      <section className="login-right">


        <div className="login-form-container">


          {/* Mobile Logo */}

          <div className="mobile-logo">

            <FaTools />

          </div>


          {/* Heading */}

          <div className="login-heading">


            <p className="welcome-text">

              WELCOME BACK

            </p>


            <h2>

              Sign in to your account

            </h2>


            <p className="login-description">

              Access your ToolGuard AI monitoring
              dashboard.

            </p>


          </div>



          {/* ================= LOGIN FORM ================= */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >


            {/* Username */}

            <div className="form-field">


              <label>

                Username

              </label>


              <div className="input-wrapper">


                <FaUser />


                <input

                  type="text"

                  placeholder="Enter your username"

                  value={username}

                  onChange={(e) =>
                    setUsername(e.target.value)
                  }

                  autoComplete="username"

                />


              </div>


            </div>



            {/* Password */}

            <div className="form-field">


              <label>

                Password

              </label>


              <div className="input-wrapper">


                <FaLock />


                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Enter your password"

                  value={password}

                  onChange={(e) =>
                    setPassword(e.target.value)
                  }

                  autoComplete="current-password"

                />


                {/* Password Eye Button */}

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowPassword(!showPassword)
                  }

                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }

                >

                  {showPassword ? (

                    <FaEyeSlash />

                  ) : (

                    <FaEye />

                  )}

                </button>


              </div>


            </div>



            {/* Forgot Password */}

            <div className="forgot-container">


              <button

                type="button"

                className="forgot-button"

                onClick={() =>
                  setShowForgotPassword(true)
                }

              >

                Forgot Password?

              </button>


            </div>



            {/* Login Button */}

            <button

              type="submit"

              className="login-button"

              disabled={loading}

            >

              {loading

                ? "Signing in..."

                : "Sign In"

              }

            </button>


          </form>



          {/* ================= SIGNUP ================= */}

          <div className="signup-section">


            <span>

              Don't have an account?

            </span>


            <button

              type="button"

              className="signup-button"

              onClick={() =>
                setShowSignup(true)
              }

            >

              Create Account

            </button>


          </div>



          {/* Security */}

          <div className="security-info">


            <FaShieldAlt />


            <span>

              Secure access to your tool monitoring system

            </span>


          </div>


        </div>


      </section>


    </div>

  );

}


export default Login;
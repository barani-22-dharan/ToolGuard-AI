import React, { useState } from "react";
import axios from "axios";

import {
  FaTools,
  FaUser,
  FaEnvelope,
  FaLock,
  FaBrain,
  FaChartLine,
  FaCogs,
  FaShieldAlt
} from "react-icons/fa";

import "./Signup.css";
function Signup({ onBackToLogin }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {

    e.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/signup",
        {
          username: username.trim(),
          email: email.trim(),
          password: password
        }
      );

      alert(response.data.message);

      setUsername("");
      setEmail("");
      setPassword("");

      onBackToLogin();

    } catch (error) {

      const message =
        error.response?.data?.detail ||
        "Account creation failed. Please try again.";

      alert(message);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="signup-page">

      {/* ================= LEFT PANEL ================= */}

      <section className="signup-left">

        <div className="signup-left-content">

          {/* Logo */}

          <div className="signup-brand-logo">
            <FaTools />
          </div>

          <h1>
            ToolGuard <span>AI</span>
          </h1>

          <p className="signup-tagline">
            Intelligent Tool Wear Monitoring
            <br />
            & Predictive Maintenance
          </p>


          {/* Features */}

          <div className="signup-feature-list">

            <div className="signup-feature-item">

              <div className="signup-feature-icon">
                <FaBrain />
              </div>

              <div>

                <h3>
                  AI-Powered Analysis
                </h3>

                <p>
                  Analyze tool and sensor data
                  using intelligent prediction.
                </p>

              </div>

            </div>


            <div className="signup-feature-item">

              <div className="signup-feature-icon">
                <FaChartLine />
              </div>

              <div>

                <h3>
                  Tool Wear Monitoring
                </h3>

                <p>
                  Track tool condition and
                  remaining useful life.
                </p>

              </div>

            </div>


            <div className="signup-feature-item">

              <div className="signup-feature-icon">
                <FaCogs />
              </div>

              <div>

                <h3>
                  Smart Maintenance
                </h3>

                <p>
                  Get maintenance recommendations
                  before tool failure.
                </p>

              </div>

            </div>

          </div>


          {/* PLM */}

          <div className="signup-plm-badge">

            <FaShieldAlt />

            <span>
              PLM Integrated Tool Lifecycle Management
            </span>

          </div>

        </div>


        {/* Decorations */}

        <div className="signup-circle signup-circle-one"></div>

        <div className="signup-circle signup-circle-two"></div>

        <div className="signup-grid"></div>

      </section>


      {/* ================= RIGHT PANEL ================= */}

      <section className="signup-right">

        <div className="signup-form-container">

          {/* Mobile Logo */}

          <div className="signup-mobile-logo">
            <FaTools />
          </div>


          {/* Heading */}

          <div className="signup-heading">

            <p className="signup-welcome">
              GET STARTED
            </p>

            <h2>
              Create your account
            </h2>

            <p className="signup-description">
              Create an account to access
              ToolGuard AI monitoring features.
            </p>

          </div>


          {/* Signup Form */}

          <form
            className="signup-form"
            onSubmit={handleSignup}
          >

            {/* Username */}

            <div className="signup-field">

              <label>
                Username
              </label>

              <div className="signup-input-wrapper">

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


            {/* Email */}

            <div className="signup-field">

              <label>
                Email Address
              </label>

              <div className="signup-input-wrapper">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="signup-field">

              <label>
                Password
              </label>

              <div className="signup-input-wrapper">

                <FaLock />

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"
              }

            </button>

          </form>


          {/* Login */}

          <div className="signup-login-section">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              className="signup-login-button"
              onClick={onBackToLogin}
            >
              Sign In
            </button>

          </div>


          {/* Security */}

          <div className="signup-security">

            <FaShieldAlt />

            <span>
              Your account credentials are securely protected
            </span>

          </div>

        </div>

      </section>

    </div>

  );
}

export default Signup;
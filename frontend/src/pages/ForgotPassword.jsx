import React, { useState } from "react";
import axios from "axios";

import {
  FaTools,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowLeft
} from "react-icons/fa";

import "./ForgotPassword.css";

function ForgotPassword({ onBackToLogin }) {

  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);


  // ==============================
  // VERIFY EMAIL
  // ==============================

  const handleVerifyEmail = async (e) => {

    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "https://toolguard-ai.onrender.com/api/auth/forgot-password",
        {
          email: email.trim()
        }
      );

      alert(response.data.message);

      setStep(2);

    } catch (error) {

      const message =
        error.response?.data?.detail ||
        "Unable to verify email.";

      alert(message);

    } finally {

      setLoading(false);

    }
  };


  // ==============================
  // RESET PASSWORD
  // ==============================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "https://toolguard-ai.onrender.com/api/auth/reset-password",
        {
          email: email.trim(),
          new_password: newPassword
        }
      );

      alert(response.data.message);

      setEmail("");
      setNewPassword("");

      onBackToLogin();

    } catch (error) {

      const message =
        error.response?.data?.detail ||
        "Password reset failed.";

      alert(message);

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="forgot-page">

      {/* LEFT SECTION */}

      <section className="forgot-left">

        <div className="forgot-left-content">

          <div className="forgot-brand-logo">
            <FaTools />
          </div>

          <h1>
            ToolGuard <span>AI</span>
          </h1>

          <p className="forgot-tagline">
            Intelligent Tool Wear Monitoring
            <br />
            & Predictive Maintenance
          </p>

          <div className="forgot-info">

            <div className="forgot-info-icon">
              <FaLock />
            </div>

            <div>
              <h3>
                Secure Account Recovery
              </h3>

              <p>
                Reset your password and securely
                regain access to your ToolGuard AI
                monitoring system.
              </p>
            </div>

          </div>

          <div className="forgot-info">

            <div className="forgot-info-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h3>
                Protected Access
              </h3>

              <p>
                Your account credentials are
                protected with secure password
                hashing.
              </p>
            </div>

          </div>

        </div>

        <div className="forgot-circle forgot-circle-one"></div>
        <div className="forgot-circle forgot-circle-two"></div>

      </section>


      {/* RIGHT SECTION */}

      <section className="forgot-right">

        <div className="forgot-form-container">

          <div className="forgot-mobile-logo">
            <FaTools />
          </div>


          {/* STEP 1 */}

          {step === 1 && (

            <>
              <div className="forgot-heading">

                <p className="forgot-welcome">
                  ACCOUNT RECOVERY
                </p>

                <h2>
                  Forgot your password?
                </h2>

                <p className="forgot-description">
                  Enter your registered email
                  address to continue.
                </p>

              </div>


              <form
                className="forgot-form"
                onSubmit={handleVerifyEmail}
              >

                <div className="forgot-field">

                  <label>
                    Email Address
                  </label>

                  <div className="forgot-input-wrapper">

                    <FaEnvelope />

                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      autoComplete="email"
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : "Continue"
                  }
                </button>

              </form>
            </>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <>
              <div className="forgot-heading">

                <p className="forgot-welcome">
                  RESET PASSWORD
                </p>

                <h2>
                  Create new password
                </h2>

                <p className="forgot-description">
                  Enter a new password for your
                  ToolGuard AI account.
                </p>

              </div>


              <form
                className="forgot-form"
                onSubmit={handleResetPassword}
              >

                <div className="forgot-field">

                  <label>
                    New Password
                  </label>

                  <div className="forgot-input-wrapper">

                    <FaLock />

                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      autoComplete="new-password"
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"
                  }
                </button>

              </form>
            </>

          )}


          {/* BACK TO LOGIN */}

          <div className="forgot-back-section">

            <button
              type="button"
              className="forgot-back-button"
              onClick={onBackToLogin}
            >

              <FaArrowLeft />

              <span>
                Back to Sign In
              </span>

            </button>

          </div>


          <div className="forgot-security">

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

export default ForgotPassword;

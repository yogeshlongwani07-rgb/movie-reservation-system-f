import "../../../css/auth-layout.css";
import { useState } from "react";
import { create } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AdminSignup() {
  const navigate = useNavigate();
  let [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    passkey: "helloworld",
  });

  function handleFormData(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function onsubmit(e) {
    e.preventDefault();
    try {
      const response = await create(formData, "admin");
      console.log("Success:", response);
      if (response.data.success) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.log("Error:", err);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        passkey: "helloworld",
      });
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="logo">Moviq</h2>

          <h1>Admin Sign Up</h1>

          <p className="subtitle">
            Already have an account? <Link to="/admin/login">Sign In</Link>
          </p>

          <form className="auth-form" onSubmit={onsubmit}>
            <label>Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              name="name"
              onChange={(e) => handleFormData(e)}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              name="email"
              value={formData.email}
              onChange={(e) => handleFormData(e)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              name="password"
              value={formData.password}
              onChange={(e) => handleFormData(e)}
            />
            <br />
            <button className="signup-btn" type="submit">
              Create Account
            </button>

            {/* <div className="divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>
            <button className="social-btn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="google-logo"
              />
              Continue with Google
            </button> */}
          </form>
        </div>
        <div className="auth-right">
          <div className="promo-card">
            <h2>Your Movie Business, All in One Place.</h2>

            <p>
              Manage your entire movie platform with confidence. Publish and
              update movies, monitor revenue, track user activity, analyze
              performance, and make data-driven decisions from a single powerful
              dashboard.
            </p>
          </div>

          <div className="feature-content">
            <h1>Every Movie. Every User. Every Dollar. One Dashboard.</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

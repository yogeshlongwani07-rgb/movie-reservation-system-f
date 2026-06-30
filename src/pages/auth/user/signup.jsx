import "../../../css/auth-layout.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userServices";

export default function UserSignup() {
  const navigate = useNavigate();

  let [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleFormData(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      console.log(response);
      if (response.data.success) {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.log(err);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="logo">Moviq</h2>

          <h1>User Sign Up</h1>

          <p className="subtitle">
            Already have an account? <a href="/user/login">Sign In</a>
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
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
              onChange={(e) => handleFormData(e)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              name="password"
              onChange={(e) => handleFormData(e)}
            />
            <br />
            <button className="signup-btn">Create Account</button>
            {/* 
            <div className="divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>
            <button className="social-btn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt=""
              />
              Continue with Google
            </button> */}
          </form>
        </div>

        <div className="auth-right">
          <div className="promo-card">
            <h2>Entertainment Without Limits..</h2>
          </div>

          <div className="feature-content">
            <h1>Where Every Frame Tells a Story.</h1>

            <p>
              Find the movies you love, explore what's trending, and build your
              perfect watchlist. From unforgettable classics to the latest
              releases, your next great story is waiting to be discovered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import "../../../css/auth-layout.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validate } from "../../../services/authService";
import { Link } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  let [formData, setFormData] = useState({
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
      const response = await validate(formData, "user");
      console.log(response);
      if (response.data.success) {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.log("error", err);
      setFormData({
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

          <h1>User Login</h1>

          <p className="subtitle">
            Create a account? <Link to="/user/signup">Sign up</Link>
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
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

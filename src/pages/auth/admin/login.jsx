import "../../../css/auth-layout.css";

export default function AdminLogin() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="logo">Moviq</h2>

          <h1>Admin Login</h1>

          <p className="subtitle">
            Create a account? <a href="/admin/signup">Sign up</a>
          </p>

          <form className="auth-form">
            <label>Email</label>
            <input type="email" placeholder="example@gmail.com" />

            <label>Password</label>
            <input type="password" placeholder="********" />
            <br />
            <button className="signup-btn">Create Account</button>

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
            </button>
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

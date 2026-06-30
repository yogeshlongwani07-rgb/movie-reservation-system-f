import "../../../css/auth-layout.css";

export default function UserSignup() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="logo">Moviq</h2>

          <h1>User Sign Up</h1>

          <p className="subtitle">
            Already have an account? <a href="/user/login">Sign In</a>
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

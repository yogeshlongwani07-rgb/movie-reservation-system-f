import "../css/userDashboard.css";
import "../css/loading.css";

export default function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-mark">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.5" y="4" width="19" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M2.5 9h4.5M17 9h4.5M2.5 15h4.5M17 15h4.5" />
        </svg>
      </div>
      <p className="loading-brand">Movieq</p>
      <div className="loading-bar">
        <span />
      </div>
      <p className="loading-caption">Rolling the film reel...</p>
    </div>
  );
}

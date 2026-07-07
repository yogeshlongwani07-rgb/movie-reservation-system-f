import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShowsForMovie } from "../../../services/movieService";

export default function Shows() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getShowsForMovie(movieId)
      .then((data) => setShows(data.shows || data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load shows."),
      );
  }, [movieId]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Shows</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {shows.map((show) => (
          <li key={show._id}>
            <button
              onClick={() =>
                navigate(`/user/movie/${movieId}/show/${show._id}/seats`)
              }
              disabled={show.availableSeats === 0}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
                background: "#fff",
                cursor: show.availableSeats === 0 ? "not-allowed" : "pointer",
                opacity: show.availableSeats === 0 ? 0.5 : 1,
              }}
            >
              <strong>
                {show.date} · {show.showTime}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
                Screen {show.screen} · {show.availableSeats} seats left
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

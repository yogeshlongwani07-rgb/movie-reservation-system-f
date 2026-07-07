import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../../../services/movieService";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMovies(1, 10)
      .then((data) => setMovies(data.movie || data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load movies."),
      );
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Movies</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {movies.map((movie) => (
          <li key={movie._id}>
            <button
              onClick={() => navigate(`/user/movie/${movie._id}/shows`)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <strong>{movie.title}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
                {movie.language} · {movie.duration} min
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

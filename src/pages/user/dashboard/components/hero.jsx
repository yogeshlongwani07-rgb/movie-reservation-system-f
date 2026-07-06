import Icon from "./icon";
import { useState, useEffect } from "react";

export default function Hero({ movie, movies, activeSlide }) {
  return (
    <>
      <section className="poster">
        <div
          className="poster-backdrop"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="poster-scrim" />

        <div className="poster-content">
          <span className="poster-eyebrow">{movie.tag}</span>
          <h2 className="poster-title">
            {movie.title}
            <br />
            {movie.subtitle}
          </h2>
          <div className="poster-meta">
            <span className="poster-rating">
              <Icon name="star" size={14} /> {movie.rating}/10
            </span>
            <span className="poster-dot" />
            <span>{movie.language}</span>
            <span className="poster-dot" />
            <span>{movie.duration}</span>
          </div>
          <div className="poster-actions">
            <button className="btn btn-primary">Book Tickets</button>
            <button className="btn btn-ghost">
              <Icon name="play" size={16} /> Watch Trailer
            </button>
          </div>
        </div>

        <div className="poster-dots">
          {movies.map((m, i) => (
            <button
              key={m.id}
              className={`poster-dot-btn ${i === activeSlide ? "is-active" : ""}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Show ${m.title}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}

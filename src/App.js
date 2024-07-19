// src/App.js
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${query}`
      );
      const data = await response.json();
      const moviesWithImages = await Promise.all(
        data.docs.map(async (movie) => {
          const imgResponse = await fetch(
            "https://dog.ceo/api/breeds/image/random"
          );
          const imgData = await imgResponse.json();
          return { ...movie, dogImage: imgData.message };
        })
      );
      setMovies(moviesWithImages);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Search</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter movie name"
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <main>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div key={index} className="movie-card">
              <img src={movie.dogImage} alt="Dog" />
              <h2>{movie.title}</h2>
              <p>{movie.author_name && movie.author_name.join(", ")}</p>
              <p>{movie.first_publish_year}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;

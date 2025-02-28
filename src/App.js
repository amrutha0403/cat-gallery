import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";
const BREED_URL = "https://api.thecatapi.com/v1/breeds";

function App() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  // Fetch cat images
  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url = API_URL;
    if (selectedBreed) {
      url = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setCats((prev) => [...prev, ...data]); // Append new cats for infinite scroll
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedBreed]);

  // Fetch cat breeds for dropdown
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(BREED_URL);
        const data = await response.json();
        setBreeds(data);
      } catch (err) {
        setError("Failed to load breeds");
      }
    };
    fetchBreeds();
  }, []);

  // Trigger fetchCats when user selects a breed
  useEffect(() => {
    setCats([]); // Clear old images when breed changes
    fetchCats();
  }, [selectedBreed, fetchCats]);

  // Infinite Scroll (load more images when reaching the bottom)
  const lastImageRef = useRef();
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchCats();
      },
      { threshold: 1 }
    );

    if (lastImageRef.current) observer.current.observe(lastImageRef.current);
  }, [loading, fetchCats]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🐱 Random Cat Images Gallery</h1>

      {/* Breed Filter Dropdown */}
      <select
        onChange={(e) => setSelectedBreed(e.target.value)}
        value={selectedBreed}
      >
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display Images */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {cats.map((cat, index) => (
          <img
            key={index}
            src={cat.url}
            alt="Cat"
            ref={index === cats.length - 1 ? lastImageRef : null}
            style={{ width: "100%", borderRadius: "10px" }}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading... ⏳</p>}
    </div>
  );
}

export default App;

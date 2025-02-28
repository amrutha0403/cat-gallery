import React, { useState, useEffect } from "react";

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";
const BREED_URL = "https://api.thecatapi.com/v1/breeds";

function App() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  // Fetch cat images
  const fetchCats = async () => {
    let url = API_URL;
    if (selectedBreed) {
      url = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setCats(data);
  };

  // Fetch cat breeds for dropdown
  const fetchBreeds = async () => {
    const response = await fetch(BREED_URL);
    const data = await response.json();
    setBreeds(data);
  };

  useEffect(() => {
    fetchCats();
    fetchBreeds();
  }, []);

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

      <button onClick={fetchCats} style={{ marginLeft: "10px" }}>
        Load More Cats 😻
      </button>

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
            style={{ width: "100%", borderRadius: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

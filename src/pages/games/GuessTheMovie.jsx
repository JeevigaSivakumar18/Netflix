import React, { useState, useEffect } from "react";
import { Dice1, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/input";
import { db } from "../../utils/firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function GuessTheMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Fetch movies from Firestore
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(movieList);
        if (movieList.length > 0) setCurrentMovie(movieList[Math.floor(Math.random() * movieList.length)]);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  const handleGuess = () => {
    if (!currentMovie) return;
    if (userInput.trim().toLowerCase() === currentMovie.title.toLowerCase()) {
      setScore(prev => prev + 1);
      alert("Correct!");
    } else {
      alert(`Wrong! The correct answer was "${currentMovie.title}"`);
    }
    setUserInput("");
    setCurrentMovie(movies[Math.floor(Math.random() * movies.length)]);
  };

  return (
    <div className="game-container" style={{ padding: "2rem", color: "white" }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back
      </Button>

      <h1 style={{ marginBottom: "1rem" }}>🎬 Guess The Movie</h1>

      {currentMovie ? (
        <div className="movie-card" style={{ marginBottom: "1rem" }}>
          <p>Hint: {currentMovie.hint || "Guess the movie title"}</p>
        </div>
      ) : (
        <p>Loading movies...</p>
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter movie name"
        />
        <Button onClick={handleGuess}>
          <Dice1 size={16} /> Guess
        </Button>
      </div>

      <div>
        <strong>Score:</strong> {score}
      </div>

      {showResult && <div>Your final score: {score}</div>}
    </div>
  );
}

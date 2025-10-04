import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase-config"; // Correct relative path
import { Button } from "../../components/ui/Button"; // Correct relative path

export default function QuoteQuiz() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Fetch movies from Firestore
  useEffect(() => {
    const fetchMovies = async () => {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setMovies(data);
      pickRandomMovie(data);
    };
    fetchMovies();
  }, []);

  const pickRandomMovie = (moviesArray) => {
    const randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)];
    setCurrentMovie(randomMovie);

    // Shuffle options including the correct answer
    const shuffledOptions = shuffleArray([
      randomMovie.title,
      ...moviesArray.filter(m => m.title !== randomMovie.title).slice(0, 3).map(m => m.title)
    ]);
    setOptions(shuffledOptions);
    setSelected(null);
    setShowResult(false);
  };

  const shuffleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === currentMovie.title) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    pickRandomMovie(movies);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Button
        onClick={() => navigate("/")}
        style={{ marginBottom: "2rem" }}
      >
        <ArrowLeft /> Back to Home
      </Button>

      {currentMovie && (
        <>
          <h2>Guess the Movie from the Quote:</h2>
          <p style={{ fontSize: "1.5rem", margin: "1rem 0" }}>"{currentMovie.quote}"</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                style={{
                  backgroundColor:
                    showResult && option === currentMovie.title
                      ? "green"
                      : showResult && option === selected
                      ? "red"
                      : "",
                  color: showResult ? "white" : "",
                }}
              >
                {option}
              </Button>
            ))}
          </div>

          {showResult && (
            <div style={{ marginTop: "1.5rem" }}>
              <p>
                {selected === currentMovie.title
                  ? "Correct! 🎉"
                  : `Wrong! Correct answer: ${currentMovie.title}`}
              </p>
              <Button onClick={handleNext} style={{ marginTop: "1rem" }}>
                Next Quote
              </Button>
            </div>
          )}

          <p style={{ marginTop: "2rem", fontWeight: "bold" }}>Score: {score}</p>
        </>
      )}
    </div>
  );
}

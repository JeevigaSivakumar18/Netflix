import { useState, useEffect } from "react";
import { Award, ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
export default function MovieTrivia() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map(doc => doc.data());
        setMovies(movieList);
        generateQuestions(movieList);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const generateQuestions = (movies) => {
    const q = [];
    const usedMovies = new Set();

    // Release year questions
    for (let i = 0; i < 5; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      if (!usedMovies.has(movie.title)) {
        usedMovies.add(movie.title);
        const year = movie.release_date?.split("-")[0];
        const answers = [year, String(Number(year)+1), String(Number(year)-1), String(Number(year)+2)].sort(() => Math.random()-0.5);
        q.push({ question: `When was "${movie.title}" released?`, answers, correctAnswer: answers.indexOf(year) });
      }
    }

    // Plot questions
    for (let i = 0; i < 5; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      if (!usedMovies.has(movie.title)) {
        usedMovies.add(movie.title);
        const wrongMovies = movies.filter(m => m.title !== movie.title).sort(() => Math.random()-0.5).slice(0,3);
        const answers = [movie, ...wrongMovies].map(m=>m.title).sort(() => Math.random()-0.5);
        q.push({ question: `Which movie has this plot: "${movie.overview}"`, answers, correctAnswer: answers.indexOf(movie.title) });
      }
    }

    setQuestions(q);
  };

  const handleAnswer = (answerIndex) => {
    if (answerIndex === questions[currentQuestion].correctAnswer) setScore(score+1);
    if (currentQuestion < questions.length-1) setCurrentQuestion(currentQuestion+1);
    else setShowResult(true);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Award className="h-16 w-16 animate-spin text-netflix-red mx-auto" />
        <p className="text-white">Loading trivia questions...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Movie Trivia Challenge</h1>
          <p className="text-gray-400">Test your knowledge of popular movies!</p>
        </div>

        <div className="bg-netflix-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          {!showResult ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg text-white">Question {currentQuestion+1} of {questions.length}</div>
                <div className="text-netflix-red font-semibold">Score: {score}</div>
              </div>

              <div className="text-xl text-white mb-8">{questions[currentQuestion].question}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].answers.map((answer, idx) => (
                  <Button key={idx} variant="outline" className="p-4 text-left hover:bg-white/10" onClick={()=>handleAnswer(idx)}>
                    {answer}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">You scored {score} out of {questions.length}!</h3>
              <p className="text-gray-300">
                {score === questions.length ? "Perfect score! You're a movie expert! 🏆" :
                score > questions.length/2 ? "Great job! You really know your movies! 🎬" :
                "Keep watching to learn more about movies! 🎥"}
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={()=>navigate(-1)}>Exit Game</Button>
                <Button className="bg-netflix-red hover:bg-red-700" onClick={()=>{
                  setCurrentQuestion(0); setScore(0); setShowResult(false); generateQuestions(movies);
                }}>Play Again</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

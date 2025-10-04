import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import TV from "./pages/Tv";
import Movies from "./pages/Movies";
import MyList from "./pages/MyList";
import SeedTv from "./components/SeedTv";
import FeelingLucky from './pages/FeelingLucky';
import SceneShuffle from "./pages/games/SceneShuffle";
import GuessTheMovie from "./pages/games/GuessTheMovie";
import MovieTrivia from "./pages/games/MovieTrivia";
import RandomScene from "./pages/games/QuoteQuiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feeling-lucky" element={<FeelingLucky />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/" element={<Netflix/>} />
        <Route path="/player" element={<Player/>} />
        <Route path="/tv" element={<TV />} />       
        <Route path="/movies" element={<Movies />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/seed" element={<SeedTv/>} />
         <Route path="/player/movie/:id" element={<Player />} />

         
         {/* Game Routes */}
  <Route path="/scene-shuffle" element={<SceneShuffle />} />
  <Route path="/guess-the-movie" element={<GuessTheMovie />} />
  <Route path="/movie-trivia" element={<MovieTrivia />} />
  <Route path="/random-scene" element={<RandomScene />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

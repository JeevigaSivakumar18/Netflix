import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import TV from "./pages/TV";
import Movies from "./pages/Movies";
import MyList from "./pages/MyList";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/" element={<Netflix/>} />
        <Route path="/player" element={<Player/>} />
        <Route path="/tv" element={<TV />} />       
        <Route path="/movies" element={<Movies />} />
        <Route path="/mylist" element={<MyList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

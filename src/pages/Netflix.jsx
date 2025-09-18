import React , {useState} from "react";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/home.jpg";
import logo from "../assets/logo.png";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getGenres } from "../store";
import { useSelector } from "react-redux";
import { fetchMovies } from "../store";
import Slider from "../components/Slider";


export default function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const genresLoaded = useSelector((state)=>state.netflix.genresLoaded);
  const dispatch = useDispatch();
  const movies = useSelector((state)=>state.netflix.movies);

  useEffect(() => {
    dispatch(getGenres());
  },[dispatch , genresLoaded]);

  useEffect(() => {
    if(genresLoaded) dispatch(fetchMovies({type : "all"}))
  });

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  console.log(movies);

  return (
    <Container>
    <div>
      <Navbar isScrolled = {isScrolled}/>
      <div className="hero">
        <img src={backgroundImage} alt="background" className="background-image" />
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Movie Logo" />
          </div>
          <div className = "buttons flex">
            <button className="flex j-center a-center" onClick={()=>navigate("/player")}>
              <FaPlay /> Play
            </button>
             <button className="flex j-center a-center">
              <AiOutlineInfoCircle /> More Info
            </button>
          </div>
      </div>
    </div>
    </div>
    <Slider movies = {movies}/>
    </Container>
  );
}
const Container = styled.div`
.netflix {
  position: relative;
  height: 100vh;
  width: 100%;
  color: white;
}

.hero {
  position: relative;
  height: 100%;
  width: 100%;
}

.background-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.container {
  position: absolute;
  bottom: 10%;
  left: 5%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logo img {
  width: 400px;
}

.buttons {
  display: flex;
  gap: 1rem;
}

button {
  border: none;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}

.play {
  background: white;
  color: black;
}

.info {
  background: rgba(109, 109, 110, 0.7);
  color: white;
}
`;
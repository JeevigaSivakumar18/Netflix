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
import { getGenres, fetchMoviesFromFirestore } from "../store";
import { useSelector } from "react-redux";
import Slider from "../components/Slider";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SeedFirebase from "../components/SeedFirebase";
export default function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  // genres are available via global state if needed
  const dispatch = useDispatch();
  const movies = useSelector((state)=>state.netflix.movies);
  const loading = useSelector((state) => state.netflix.loading);
  const error = useSelector((state) => state.netflix.error);

  // Fetch genres once on mount
  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  // When genres are loaded (from genre slice), fetch movies once
  useEffect(() => {
    // Load movies from Firestore once genres are loaded (or on mount)
    dispatch(fetchMoviesFromFirestore());
  }, [dispatch]);

  // Handle scroll state with proper event listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    // set initial value
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(movies);

  return (
  <Container>
  <SeedFirebase />
  {loading && <Loading />}
  {error && <ErrorMessage message={error} />}
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
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGenres, fetchMoviesFromFirestore } from "../store";
import Slider from "../components/Slider";
import styled from "styled-components";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SeedFirebase from "../components/SeedFirebase";

export default function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.genre.genres);
  const loading = useSelector((state) => state.netflix.loading);
  const error = useSelector((state) => state.netflix.error);

  useEffect(() => {
    dispatch(getGenres());
    dispatch(fetchMoviesFromFirestore());
  }, [dispatch]);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const featuredMovie = movies && movies.length > 0 ? movies[currentIndex % movies.length] : null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Direct video URLs for trailers (you can add more)
  const trailerUrls = {
    "inception": "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&controls=1&rel=0",
    "the dark knight": "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&controls=1&rel=0",
    "avengers endgame": "https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1&controls=1&rel=0",
    "spider man no way home": "https://www.youtube.com/embed/JfVOs4VSpmA?autoplay=1&controls=1&rel=0",
    "the lord of the rings the return of the king": "https://www.youtube.com/embed/r5X-hFf6Bwo?autoplay=1&controls=1&rel=0",
    "interstellar": "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&controls=1&rel=0",
    "forrest gump": "https://www.youtube.com/embed/bLvqoHBptjg?autoplay=1&controls=1&rel=0",
    "pulp fiction": "https://www.youtube.com/embed/s7EdQ4FqbhY?autoplay=1&controls=1&rel=0",
    "the godfather": "https://www.youtube.com/embed/UaVTIH8mujA?autoplay=1&controls=1&rel=0",
    "the matrix": "https://www.youtube.com/embed/vKQi3bBA1y8?autoplay=1&controls=1&rel=0",
    "titanic": "https://www.youtube.com/embed/kVrqfYjkVdQ?autoplay=1&controls=1&rel=0",
    "jurassic park": "https://www.youtube.com/embed/lc0U81P36Qc?autoplay=1&controls=1&rel=0",
    "star wars the force awakens": "https://www.youtube.com/embed/sGbxmsDFVnE?autoplay=1&controls=1&rel=0",
    "gladiator": "https://www.youtube.com/embed/owK1qxDselE?autoplay=1&controls=1&rel=0",
    "mad max fury road": "https://www.youtube.com/embed/hEJnMQG9ev8?autoplay=1&controls=1&rel=0",
    "black panther": "https://www.youtube.com/embed/xjDjIWPwcPU?autoplay=1&controls=1&rel=0",
    "parasite": "https://www.youtube.com/embed/5xH0HfJHsaY?autoplay=1&controls=1&rel=0",
    "dune": "https://www.youtube.com/embed/8g18jFHCLXk?autoplay=1&controls=1&rel=0",
    "oppenheimer": "https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1&controls=1&rel=0",
    "the batman": "https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1&controls=1&rel=0",
    "john wick": "https://www.youtube.com/embed/C0BMx-qxsP4?autoplay=1&controls=1&rel=0",
    "mission impossible fallout": "https://www.youtube.com/embed/wb49-oV0F78?autoplay=1&controls=1&rel=0",
    "deadpool": "https://www.youtube.com/embed/ONHBaC-pfsk?autoplay=1&controls=1&rel=0",
    "spider man into the spider verse": "https://www.youtube.com/embed/g4Hbz2jLxvQ?autoplay=1&controls=1&rel=0",
    "frozen ii": "https://www.youtube.com/embed/Zi4LMpSDccc?autoplay=1&controls=1&rel=0",
    "aladdin": "https://www.youtube.com/embed/foyufD52aog?autoplay=1&controls=1&rel=0",
    "coco": "https://www.youtube.com/embed/Ga6RYejo6Hk?autoplay=1&controls=1&rel=0",
    "captain marvel": "https://www.youtube.com/embed/Z1BCujX3pw8?autoplay=1&controls=1&rel=0",
    "encanto": "https://www.youtube.com/embed/CaimKeDcudo?autoplay=1&controls=1&rel=0",
    "turning red": "https://www.youtube.com/embed/XdKzUbAiswE?autoplay=1&controls=1&rel=0",
    "black widow": "https://www.youtube.com/embed/RxAtuMu_ph4?autoplay=1&controls=1&rel=0",
    "a quiet place": "https://www.youtube.com/embed/WR7cc5t7tv8?autoplay=1&controls=1&rel=0",
    "la la land": "https://www.youtube.com/embed/0pdqf4P9MB8?autoplay=1&controls=1&rel=0",
    "whiplash": "https://www.youtube.com/embed/7d_jQycdQGo?autoplay=1&controls=1&rel=0",
    "get out": "https://www.youtube.com/embed/DzfpyUB60YY?autoplay=1&controls=1&rel=0",
    "knives out": "https://www.youtube.com/embed/sL-9Khv7wa4?autoplay=1&controls=1&rel=0"
  };

  const handlePlayFeatured = () => {
    if (featuredMovie) {
      const movieTitle = (featuredMovie.title || featuredMovie.name).toLowerCase();
      
      // Find trailer URL from our mapping
      let trailerUrl = null;
      
      // Exact match
      if (trailerUrls[movieTitle]) {
        trailerUrl = trailerUrls[movieTitle];
      } else {
        // Partial match
        for (const [key, url] of Object.entries(trailerUrls)) {
          if (movieTitle.includes(key) || key.includes(movieTitle)) {
            trailerUrl = url;
            break;
          }
        }
      }

      if (trailerUrl) {
        setCurrentVideoUrl(trailerUrl);
        setShowVideoPlayer(true);
      } else {
        // Fallback - open YouTube directly with the trailer search
        const searchQuery = encodeURIComponent(`${featuredMovie.title || featuredMovie.name} official trailer`);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideoUrl("");
  };

  // Close video player when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeVideoPlayer();
      }
    };

    if (showVideoPlayer) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoPlayer]);

  return (
    <Container>
      <SeedFirebase />
      {loading && <LoadingOverlay><Loading /></LoadingOverlay>}
      {error && <ErrorMessage message={error} />}
      <Navbar isScrolled={isScrolled} />

      {showVideoPlayer && (
        <VideoPlayerOverlay onClick={closeVideoPlayer}>
          <VideoPlayerContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeVideoPlayer}>×</CloseButton>
            <VideoIframe
              src={currentVideoUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoPlayerContainer>
        </VideoPlayerOverlay>
      )}

      {featuredMovie && (
        <HeroSection>
          <BackgroundContainer>
            <img
              src={featuredMovie.backdrop || featuredMovie.poster}
              alt={featuredMovie.title || featuredMovie.name}
              className="background-image"
            />
            <div className="gradient-overlay" />
          </BackgroundContainer>

          <HeroContent>
            <h1>{featuredMovie.name || featuredMovie.title}</h1>
            <p>{(featuredMovie.description || "").slice(0, 200)}{(featuredMovie.description || "").length > 200 ? "..." : ""}</p>
            <div className="hero-buttons">
              <PlayButton onClick={handlePlayFeatured}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play Trailer
              </PlayButton>
            </div>
          </HeroContent>
        </HeroSection>
      )}

      <ContentSection>
        <Slider movies={movies} loading={loading} error={error} />
      </ContentSection>
    </Container>
  );
}

/* Styled components */
const Container = styled.div`
  background-color: #141414;
  min-height: 100vh;
  color: white;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.8);
  z-index: 999;
`;

const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
`;

const BackgroundContainer = styled.div`
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; z-index: 1;
  .background-image {
    width: 100%; height: 100%; object-fit: cover;
    transition: opacity 1s ease-in-out;
    filter: brightness(0.6);
  }
  .gradient-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  }
`;

const HeroContent = styled.div`
  position: relative; z-index: 2; margin-left: 4rem; max-width: 600px;
  h1 { 
    font-size: 3rem; 
    margin-bottom: 1rem; 
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  p { 
    color: #ddd; 
    line-height: 1.3; 
    margin-bottom: 1.2rem; 
    font-size: 1.1rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }
  .hero-buttons { 
    display:flex; 
    gap: 1rem; 
  }

  @media (max-width: 768px) {
    margin-left: 2rem;
    max-width: 80%;
    
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContentSection = styled.section`
  margin-top: -120px;
  position: relative;
  z-index: 2;
  padding: 1rem 1.5rem 3rem;
`;

// Video Player Styles
const VideoPlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1000px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 28px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 1);
    transform: scale(1.1);
  }
`;

const VideoIframe = styled.iframe`
  width: 100%;
  height: 70vh;
  min-height: 500px;
  border: none;
  background: #000;

  @media (max-width: 768px) {
    height: 50vh;
    min-height: 300px;
  }

  @media (max-width: 480px) {
    height: 40vh;
    min-height: 250px;
  }
`;
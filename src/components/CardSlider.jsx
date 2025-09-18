import React, { useState, useRef } from "react";
import styled from "styled-components";
import video from "../assets/video.mp4";

function CardSlider({ title, data }) {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const timeoutRef = useRef(null);

  const handlePlay = (movie) => {
    setCurrentVideo(movie);
    setIsFullscreen(true);
    setIsHovered(false);
    setHoveredMovie(null);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setCurrentVideo(null);
  };

  const handleMouseEnter = (movie) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a delay before showing the clip
    timeoutRef.current = setTimeout(() => {
      setHoveredMovie(movie);
      setIsHovered(true);
    }, 500); // 500ms delay
  };

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsHovered(false);
    setTimeout(() => {
      setHoveredMovie(null);
    }, 300); // Small delay for smooth transition
  };

  return (
    <>
      <Container>
        <h2>{title}</h2>
        <div className="wrapper">
          <div className="slider">
            {data && data.length > 0 ? (
              data.map((movie, index) => (
                <div 
                  key={`${movie.id}-${index}`} 
                  className={`card ${hoveredMovie?.id === movie.id ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMouseEnter(movie)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredMovie?.id === movie.id && isHovered ? (
                    <div className="video-container">
                      {/* You can replace this with actual video/trailer */}
                      <video
                        src={video}
                        autoPlay
                        muted
                        loop
                        className="hover-video"
                      />
                      <div className="movie-info">
                        <h4>{movie.name}</h4>
                        <p>{movie.genres?.join(', ')}</p>
                        <div className="action-buttons">
                          <button 
                            className="play-btn" 
                            onClick={() => handlePlay(movie)}
                          >
                            ▶ Play
                          </button>
                          <button className="info-btn">ℹ More Info</button>
                          <button className="like-btn">👍</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                        alt={movie.name}
                        loading="lazy"
                      />
                      <p>{movie.name}</p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="empty">No movies available</p>
            )}
          </div>
        </div>
      </Container>

      {/* Fullscreen Video Modal */}
      {isFullscreen && currentVideo && (
        <FullscreenModal>
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseFullscreen}>
              ✕
            </button>
            <video
              src={video}
              autoPlay
              controls
              className="fullscreen-video"
            />
            <div className="video-info">
              <h2>{currentVideo.name}</h2>
              <p>{currentVideo.genres?.join(', ')}</p>
            </div>
          </div>
        </FullscreenModal>
      )}
    </>
  );
}

export default CardSlider;

const Container = styled.div`
  background-color: #141414;
  padding: 40px 0 20px 0;

  h2 {
    margin-left: 50px;
    margin-bottom: 15px;
    color: white;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .wrapper {
    position: relative;

    .slider {
      display: flex;
      width: max-content;
      gap: 1rem;
      margin-left: 50px;
      transform: translateX(0px);
      transition: all 0.3s ease-in-out;

      .card {
        width: 150px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          transform: scale(1.05);
        }

        &.hovered {
          width: 300px;
          height: 200px;
          transform: scale(1.1);
          z-index: 10;
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
        }

        img {
          width: 100%;
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
        }

        p {
          color: white;
          margin-top: 5px;
          font-size: 0.9rem;
          text-align: center;
        }

        .video-container {
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;

          .hover-video {
            width: 100%;
            height: 120px;
            object-fit: cover;
          }

          .movie-info {
            padding: 10px;
            color: white;

            h4 {
              font-size: 0.9rem;
              margin: 0 0 5px 0;
              font-weight: bold;
            }

            p {
              font-size: 0.7rem;
              color: #ccc;
              margin: 0 0 10px 0;
              text-align: left;
            }

            .action-buttons {
              display: flex;
              gap: 5px;
              align-items: center;

              button {
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                font-size: 0.7rem;
                cursor: pointer;
                transition: all 0.2s;

                &.play-btn {
                  background: white;
                  color: black;
                  font-weight: bold;

                  &:hover {
                    background: #e6e6e6;
                  }
                }

                &.info-btn {
                  background: rgba(109, 109, 110, 0.7);
                  color: white;

                  &:hover {
                    background: rgba(109, 109, 110, 1);
                  }
                }

                &.like-btn {
                  background: transparent;
                  color: white;
                  border: 1px solid #333;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  &:hover {
                    border-color: white;
                  }
                }
              }
            }
          }
        }
      }

      .empty {
        color: gray;
        margin-left: 50px;
      }
    }
  }
`;

const FullscreenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
    }

    .fullscreen-video {
      width: 100%;
      height: 70%;
      object-fit: contain;
      border-radius: 8px;
    }

    .video-info {
      margin-top: 20px;
      text-align: center;
      color: white;

      h2 {
        font-size: 2rem;
        margin-bottom: 10px;
        font-weight: 700;
      }

      p {
        font-size: 1.2rem;
        color: #ccc;
        margin: 0;
      }
    }
  }

  /* Close modal when clicking outside */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
`;
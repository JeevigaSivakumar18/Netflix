import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import video from "../assets/video.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { removeFromLikedMovies, addToLikedMovies } from "../store";

export default React.memo(function Card({ movieData }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get liked movies from redux store
  const likedMovies = useSelector((state) => state.netflix.likedMovies || []);

  // Check if current movie is already liked
  const isLiked = likedMovies.some((movie) => movie.id === movieData.id);

  // Toggle add/remove from liked list
  const handleLikeToggle = () => {
    if (isLiked) {
      dispatch(removeFromLikedMovies(movieData.id));
    } else {
      dispatch(addToLikedMovies(movieData));
    }
  };

  const imageUrl = movieData.poster
    ? `https://image.tmdb.org/t/p/w500${movieData.poster}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt={movieData.name} />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={imageUrl}
              alt={movieData.name}
              onClick={() => navigate("/player")}
            />
            <video
              src={video}
              autoPlay
              loop
              muted
              onClick={() => navigate("/player")}
            ></video>
          </div>
          <div className="info-container flex container">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="Play"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill title="Like" />
                <RiThumbUpFill title="Dislike" />
                {isLiked ? (
                  <BsCheck title="Remove From List" onClick={handleLikeToggle} />
                ) : (
                  <AiOutlinePlus title="Add to My List" onClick={handleLikeToggle} />
                )}
              </div>
              <div className="info">
                <BiChevronDown
                  title="More Info"
                  onClick={() => navigate("/player")}
                />
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
)

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  cursor: pointer;
  position: relative;

  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  .hover {
    position: absolute;
    top: -120px; /* adjust how high it floats */
    left: -60px;
    width: 320px;
    height: 360px;
    background-color: #181818;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 15px;
    z-index: 99;
    overflow: hidden;

    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    pointer-events: none;
  }

  &:hover .hover {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
  }

  .hover .image-video-container {
    position: relative;
    width: 100%;
    height: 55%;
    border-radius: 0.5rem 0.5rem 0 0;
    overflow: hidden;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }

    video {
      z-index: 5;
    }
  }

  .hover .info-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;

    h3 {
      font-size: 1rem;
      color: white;
      margin: 0;
      cursor: pointer;
    }

    .icons {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .controls {
        display: flex;
        gap: 1rem;
      }

      svg {
        font-size: 1.5rem;
        cursor: pointer;
        transition: 0.2s ease-in-out;

        &:hover {
          color: #b3b3b3;
        }
      }
    }

    .genres ul {
      display: flex;
      gap: 0.7rem;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        font-size: 0.8rem;
        color: #b3b3b3;
      }
    }
  }
`;






import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import video from "../assets/video.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addToListAsync, removeFromListAsync } from "../store/myListSlice";

export default function Card({ movieData }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myList = useSelector((state) => state.myList);
  const inList = myList.some((m) => m.id === movieData.id);

  // Local add/remove is handled inline on the button to provide immediate feedback

  // Support both TMDB-style and our Firestore normalized fields
  const posterPath = movieData.poster_path || movieData.poster || movieData.backdrop;
  const imageUrl = posterPath
    ? (posterPath.startsWith("http") ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`)
    : "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt={movieData.name || movieData.title} />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={imageUrl}
              alt={movieData.name || movieData.title}
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

          <div className="info-container flex container" style={{position : "absolute", bottom : "-10px"}}>
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name || movieData.title}
            </h3>

            <div className="controls flex j-between">
              {/* Play button */}
              <button
                className="btn play-btn"
                onClick={() => {
                  // navigate to player with movie data in state
                  navigate("/player", { state: { movie: movieData } });
                }}
                aria-label="Play"
              >
                <IoPlayCircleSharp />
                <span>Play</span>
              </button>

              {/* More info button */}
              <button
                className="btn info-btn"
                onClick={() => navigate("/player", { state: { movie: movieData } })}
                aria-label="More info"
              >
                <BiChevronDown />
                <span>Info</span>
              </button>

              {/* Add / Remove from My List button */}
              <button
                className="btn list-btn"
                onClick={() => {
                  if (inList) {
                    dispatch(removeFromListAsync(movieData.id));
                    try {
                      window.dispatchEvent(new CustomEvent("myListLocal", { detail: { action: "removed", name: movieData.name || movieData.title } }));
                    } catch (e) {}
                  } else {
                    dispatch(addToListAsync(movieData));
                    try {
                      window.dispatchEvent(new CustomEvent("myListLocal", { detail: { action: "added", name: movieData.name || movieData.title } }));
                    } catch (e) {}
                  }
                }}
                aria-label="Add to My List"
              >
                <AiOutlinePlus />
                <span>{inList ? "Remove" : "My List"}</span>
              </button>
            </div>

            <div className="genres flex">
              <ul className="flex">
                {movieData.genres?.map((genre) => (
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
    top: -120px;
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
    pointer-events: auto;
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
      pointer-events: none; /* prevent video/image from blocking clicks */
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
    position: relative;
    z-index: 10;

    h3 {
      font-size: 1rem;
      color: white;
      margin: 0;
      cursor: pointer;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      pointer-events: auto; /* enable clicks on icons */
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.5rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08);
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn span { font-size: 0.85rem; }

    svg {
      font-size: 1.5rem;
      cursor: pointer;
      transition: 0.2s ease-in-out;
      pointer-events: auto;

      &:hover {
        color: #b3b3b3;
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

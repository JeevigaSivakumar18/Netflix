import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";

export default function Card({ movieData, onAddToList }) {
  const [details, setDetails] = useState(null);
  const [inMyList, setInMyList] = useState(false);

  // ✅ Check if movie is in My List
  useEffect(() => {
    const checkIfInList = async () => {
      const user = auth.currentUser;
      if (!user || !movieData?.tmdbId) return;

      const movieRef = doc(db, "users", user.uid, "myList", movieData.tmdbId.toString());
      const docSnap = await getDoc(movieRef);
      setInMyList(docSnap.exists());
    };

    checkIfInList();
  }, [movieData]);

  // ✅ Toggle add/remove from list
  const handleToggleList = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first!");
      return;
    }

    const movieRef = doc(db, "users", user.uid, "myList", movieData.tmdbId.toString());

    try {
      if (inMyList) {
        await deleteDoc(movieRef);
        setInMyList(false);
        alert(`${movieData.title} removed from My List`);
      } else {
        await setDoc(movieRef, movieData);
        setInMyList(true);
        alert(`${movieData.title} added to My List`);
      }
    } catch (err) {
      console.error("Error updating My List:", err);
    }
  };

  // ✅ Fetch TMDB details
  useEffect(() => {
    if (!movieData?.tmdbId) return;

    const fetchMovieDetails = async () => {
      try {
        const apiKey = "7b73a00bcdb4776989a1ccc50f41887a"; // replace with your TMDB API key
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieData.tmdbId}?api_key=${apiKey}&append_to_response=videos`
        );
        if (!res.ok) {
          console.warn("TMDB fetch failed for", movieData.tmdbId, res.status);
          return;
        }
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching TMDB data:", err);
      }
    };

    fetchMovieDetails();
  }, [movieData?.tmdbId]);

  if (!movieData) return null;

  // ✅ Poster path logic
  const poster = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : movieData.poster || movieData.backdrop || "/placeholder_poster.png";

  // ✅ Trailer key logic
  const trailerKey =
    details?.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ||
    (movieData.video && movieData.video.length <= 20 ? movieData.video : null);

  const title = movieData.title || movieData.name || "Untitled";

  return (
    <CardContainer>
      <Poster src={poster} alt={title} />
      <Info>
        <Title>{title}</Title>
        <Genres>{(movieData.genres || []).join(" • ")}</Genres>
        <Description>{movieData.description}</Description>
        <Buttons>
          <AddButton onClick={handleToggleList}>
            {inMyList ? "❌ Remove" : "➕ Add"}
          </AddButton>
          {trailerKey ? (
            <PlayButton
              onClick={() =>
                window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank")
              }
            >
              ▶ Play
            </PlayButton>
          ) : (
            <PlayButton disabled>▶ Play</PlayButton>
          )}
          <MoreInfoButton>ℹ More Info</MoreInfoButton>
        </Buttons>
      </Info>
    </CardContainer>
  );
}

/* ---------------- Styled Components ---------------- */
const CardContainer = styled.div`
  background: #1c1c1c;
  border-radius: 8px;
  overflow: hidden;
  width: 220px;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  color: white;
  flex: 0 0 auto;
`;

const Poster = styled.img`
  width: 100%;
  height: 330px;
  object-fit: cover;
  background: #222;
`;

const Info = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin: 0;
`;

const Genres = styled.span`
  font-size: 0.75rem;
  color: #b3b3b3;
`;

const Description = styled.p`
  font-size: 0.8rem;
  color: #b3b3b3;
  height: 3em;
  overflow: hidden;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const AddButton = styled.button`
  background: #e50914;
  border: none;
  color: white;
  font-size: 1rem;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
`;

const PlayButton = styled.button`
  background: #fff;
  border: none;
  color: #000;
  font-weight: 600;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
`;

const MoreInfoButton = styled.button`
  background: #6d6d6d;
  border: none;
  color: white;
  font-weight: 500;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
`;

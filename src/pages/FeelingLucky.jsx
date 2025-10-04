import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Dice1, Sparkles } from "lucide-react";
import { fetchMoviesFromFirestore } from "../store/netflixSlice";

const FeelingLucky = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { movies, loading } = useSelector((state) => state.netflix);

  useEffect(() => {
    if (movies.length === 0 && !loading) {
      dispatch(fetchMoviesFromFirestore());
    }
  }, [dispatch, movies.length, loading]);

  const pickRandom = () => {
    if (movies.length === 0) return;
    const random = movies[Math.floor(Math.random() * movies.length)];
    navigate(`/player/movie/${random.id}`);
  };

  return (
    <Container>
      <Content>
        <Badge>
          <Sparkles className="icon" size={16} />
          Feeling adventurous?
        </Badge>

        <Title>Feeling Lucky?</Title>

        <Description>
          Click below to jump right into a random popular title. Great for movie
          nights when no one can decide.
        </Description>

        <SurpriseButton
          onClick={pickRandom}
          disabled={loading || movies.length === 0}
        >
          <Dice1 size={24} />
          {loading
            ? "Loading Movies..."
            : movies.length === 0
            ? "No Movies Available"
            : "Surprise Me"}
        </SurpriseButton>

        {/* Back to Home button */}
        <BackButton onClick={() => navigate("/")}>← Back to Home</BackButton>
      </Content>
    </Container>
  );
};

export default FeelingLucky;

// ------------------ STYLES ------------------

const Container = styled.div`
  min-height: 100vh;
  background: #141414;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

const Content = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  font-size: 0.875rem;

  .icon {
    color: #fbbf24;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const Description = styled.p`
  color: #9ca3af;
  max-width: 36rem;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.6;
`;

const SurpriseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: #e50914;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #f40612;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

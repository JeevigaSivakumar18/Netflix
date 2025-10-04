import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import { auth, db } from "../utils/firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function MyList() {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const fetchMyList = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const listCol = collection(db, "users", user.uid, "myList");
      const listSnapshot = await getDocs(listCol);
      const movies = listSnapshot.docs.map((doc) => doc.data());
      setMyList(movies);
    };

    fetchMyList();
  }, []);

  const handleAddToList = (movie) => {
    // You already have this logic working, so leave as is
    alert(`Add to list clicked for ${movie.title}`);
  };

  return (
    <Container>
      <Navbar isScrolled={true} />

      <ContentWrapper>
        <Header>
          <h1>My List</h1>
          <p>{myList.length} {myList.length === 1 ? "movie" : "movies"}</p>
        </Header>

        {myList.length === 0 ? (
          <EmptyState>
            <h2>Your list is empty</h2>
            <p>Movies and shows you add will appear here.</p>
            <button onClick={() => window.history.back()}>Browse Movies</button>
          </EmptyState>
        ) : (
          <CardSlider movies={myList} onAddToList={handleAddToList} />
        )}
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
  color: white;
`;

const ContentWrapper = styled.div`
  padding: 100px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 { font-size: 2.5rem; margin: 0; }
  p { color: #b3b3b3; }
`;

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
  h2 { font-size: 2rem; }
  p { color: #b3b3b3; margin: 10px 0 20px 0; }
  button {
    padding: 10px 20px;
    background: #e50914;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }
`;

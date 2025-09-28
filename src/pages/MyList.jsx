import React from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";

export default function MyList() {
  const myList = useSelector((state) => state.myList || []);

  return (
    <div>
      <h2>My List</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: 'wrap' }}>
        {myList.length === 0 && <p>No movies yet</p>}
        {myList.map((movie) => (
          <Card
            key={movie.id}
            movieData={movie}
          />
        ))}
      </div>
    </div>
  );
}

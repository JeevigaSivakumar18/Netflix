import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from '../store';

function SelectGenre({ genres = [], type }) {
  const dispatch = useDispatch();
  const genreList = useSelector((state) => state.genre.genres || []);



  const allMovies = useSelector((state) => state.netflix.movies || []);

  const onChange = async (e) => {
    const id = e.target.value;
    if (!id) {
      // reset to full list
      dispatch(setMovies(allMovies));
      return;
    }

    // Filter client-side from already-loaded movies (Firestore)
    const selectedGenre = genreList.find((g) => String(g.id) === String(id))?.name;
    if (!selectedGenre) {
      window.alert('Genre not found');
      return;
    }
    const filtered = (Array.isArray(allMovies) ? allMovies : []).filter((m) => (m.genres || []).includes(selectedGenre));
    if (!filtered || filtered.length === 0) {
      window.alert(`No movies found for genre "${selectedGenre}"`);
      return; // keep previous list
    }
    dispatch(setMovies(filtered));
  };

  return (
    <Select className="flex" onChange={onChange}>
      <option value="">-- Select Genre --</option>
      {(
        (Array.isArray(genreList) && genreList.length > 0 ? genreList : (Array.isArray(genres) ? genres : []))
      ).map((genre) => (
        <option key={genre.id} value={genre.id}>{genre.name}</option>
      ))}
    </Select>
  );
}

export default SelectGenre;

const Select = styled.select`
  margin: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  background-color: white;
  color: black;
  z-index: 10;
  position: relative;
`;

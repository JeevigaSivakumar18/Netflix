import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux';
import { fetchMoviesByGenre } from '../store';


function SelectGenre({genres , type}) {
  const dispatch = useDispatch();
  return (
   <Select className="flex" onChange={e => {
    dispatch(fetchMoviesByGenre({genre: e.target.value, type}));
   }}>
    {genres.map((genre) =>{
        return (<option value={genre.id}>
            {genre.name}
        </option>
    );
    })}
   </Select>
  )
}

export default SelectGenre

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
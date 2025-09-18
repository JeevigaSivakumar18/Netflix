import React from 'react'
import styled from 'styled-components'


function SelectGenre({genres , type}) {
  return (
   <Select>
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
import React from 'react'
import background from "../assets/bggg.jpg"
import styled from 'styled-components'
export default function BackgroundImage() {
  return (
    <Container>
        <img src={background} alt="background" />
    </Container>
  );
}
 const Container = styled.div`
 height: 100vh;
  width: 100vw;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;   /* 👈 makes image cover entire container */
  }
`;
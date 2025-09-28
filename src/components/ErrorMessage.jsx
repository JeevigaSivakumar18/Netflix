import React from 'react';
import styled from 'styled-components';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <Container>
      <div className="message">{message}</div>
    </Container>
  );
}

const Container = styled.div`
  color: #ffdddd;
  background: rgba(255,0,0,0.08);
  border: 1px solid rgba(255,0,0,0.15);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin: 1rem 2rem;
`;

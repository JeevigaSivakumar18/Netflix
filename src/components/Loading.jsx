import React from 'react';
import styled from 'styled-components';

export default function Loading({ children = 'Loading...' }) {
  return (
    <Container>
      <div className="spinner" />
      <div className="text">{children}</div>
    </Container>
  );
}

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .spinner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 4px solid rgba(255,255,255,0.2);
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  .text { margin-top: 0.5rem; }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

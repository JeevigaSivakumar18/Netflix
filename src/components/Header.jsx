import React from 'react'
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";

export default function Header({login}){
    const navigate = useNavigate();
    return (
        <Container className="flex a-center j-between">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
           <button onClick ={()=> navigate(login ? "/login":"/signup")}>
    {login ? "Log In" : "Sign In"}
</button>

        </Container>
    );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 10vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;
  z-index: 2;
  button {
   
    margin-right: 7rem; 
    font-size: 1.05rem;
    background-color: #e50914;
    border: none;
    cursor: pointer;
    border-radius: 0.2rem;
    font-weight: bolder;
    color: white;
  }
`;
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import React, { useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate("/"); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <div className="overlay">
        <Header />
        <div className="form-wrapper">
          <div className="form-container">
            <div className="title">
              <h3>Login</h3>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, [e.target.name]: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValues.password}
              onChange={(e) =>
                setFormValues({ ...formValues, [e.target.name]: e.target.value })
              }
            />
            <button onClick={handleLogin}>Log In</button>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  /* BackgroundImage should cover everything */
  > *:first-child {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .overlay {
    position: relative;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6); /* dark overlay */
    display: flex;
    flex-direction: column;
  }

  .form-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;  /* center horizontally */
    align-items: center;      /* center vertically */
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    background: rgba(0, 0, 0, 0.75);
    padding: 3rem 2rem;
    border-radius: 8px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    padding: 0.9rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
  }

  button {
    padding: 0.9rem 1.2rem;
    background-color: red;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }

  .title h3 {
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

export default Login;

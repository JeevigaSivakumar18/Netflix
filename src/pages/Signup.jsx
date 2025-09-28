import { 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
 } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import React, { useState , useEffect } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

import { signOut } from "firebase/auth";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const Navigate = useNavigate();

  useEffect(() => {
  signOut(firebaseAuth);  // 👈 force logout when visiting signup
}, []);

  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log("User signed up successfully!");
    } catch (err) {
      console.log("Firebase error:", err.message);
    }
  };
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        Navigate("/");  // user is logged in → go home
      } else {
        setLoading(false);  // user not logged in → stop loading, show signup page
      }
    });
    return () => unsubscribe();
  }, [Navigate]);

  if (loading) return null;

  return (
    <Container showPassword={showPassword}>
      <BackgroundImage />
      <div className="content">
        <Header login={true} />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited movies, TV shows and more</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>
              Ready to watch? Enter your email to create or restart membership
            </h6>
          </div>
          <div className="form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, [e.target.name]: e.target.value })
              }
            />
            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            )}
            {!showPassword && (
              <button onClick={() => setShowPassword(true)}>Get Started</button>
            )}
          </div>
          <button onClick={handleSignIn}>Sign up</button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .body {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 1;
  }
  .form {
    display: grid;
    grid-template-columns: ${({ showPassword }) =>
      showPassword ? "1fr 1fr" : "2fr 1fr"};
    margin-top: 1rem;
    gap: 0.5rem;
  }
  input {
    padding: 0.8rem;
    font-size: 1rem;
  }
  button {
    padding: 0.8rem 1.2rem;
    background-color: red;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }
`;

export default Signup;

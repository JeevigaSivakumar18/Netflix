import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaSearch, FaPowerOff } from "react-icons/fa";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Navbar({ isScrolled }) {
  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  const navigate = useNavigate();
  const [showSearch, setShowSearch] = React.useState(false);
  const [inputHover, setInputHover] = React.useState(false);

  React.useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
  }, [navigate]);

  return (
    <Container>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="Netflix Logo" />
          </div>
          <ul className="links flex">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="right flex a-center">
          <div className={`search ${showSearch ? "show" : ""}`}>
            <button
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) setShowSearch(false);
              }}
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search"
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setShowSearch(false);
                setInputHover(false);
              }}
            />
            <button
              onClick={() => {
                signOut(firebaseAuth);
              }}
            >
              <FaPowerOff />
            </button>
          </div>
        </div>
      </nav>
    </Container>
  );
}

export default Navbar;

const Container = styled.div`
  nav {
    position: fixed;
    top: 0;
    height: 6.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4rem;
    z-index: 10;
    transition: background-color 0.3s ease-in-out;
    background: black; /* ✅ always black like before */
  }

  .left {
    display: flex;
    align-items: center;
    gap: 2rem;

    .brand img {
      height: 2.5rem;
    }

    .links {
      list-style-type: none;
      display: flex;
      gap: 2rem;

      li a {
        color: white; /* ✅ white links restored */
        text-decoration: none;
        font-weight: 500;
        transition: 0.3s ease-in-out;

        &:hover {
          color: #b3b3b3;
        }
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 1rem;

    .search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;

      button {
        background: transparent;
        border: none;
        cursor: pointer;
        color: white;
        font-size: 1.2rem;

        &:hover {
          color: #b3b3b3;
        }
      }

      input {
        width: 0;
        opacity: 0;
        visibility: hidden;
        transition: 0.3s ease-in-out;
        padding: 0.3rem 0.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
      }

      &.show input {
        width: 150px;
        opacity: 1;
        visibility: visible;
        background-color: white;
        color: black;
      }
    }
  }
`;

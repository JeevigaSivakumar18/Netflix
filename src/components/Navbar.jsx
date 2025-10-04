import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaPowerOff, FaCaretDown } from "react-icons/fa";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Navbar({ isScrolled }) {
  const links = [
    { name: "Home", link: "/" },
    //{ name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
    { name: "Feeling Lucky", link: "/feeling-lucky" },
  ];

  const games = [
    { name: "Scene Shuffle", link: "/scene-shuffle" },
    { name: "Guess the Movie", link: "/guess-the-movie" },
    { name: "Movie Trivia", link: "/movie-trivia" },
    { name: "Random Scene", link: "/random-scene" },
  ];

  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [gamesOpen, setGamesOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGamesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
  }, [navigate]);

  const toggleGamesDropdown = () => {
    setGamesOpen(!gamesOpen);
  };

  const handleGamesLinkClick = () => {
    setGamesOpen(false);
  };

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

            {/* Games Dropdown */}
            <li className="games-dropdown" ref={dropdownRef}>
              <span 
                className="games-title" 
                onClick={toggleGamesDropdown}
              >
                Games <FaCaretDown className={`dropdown-arrow ${gamesOpen ? "open" : ""}`} />
              </span>
              {gamesOpen && (
                <ul className="dropdown">
                  {games.map(({ name, link }) => (
                    <li key={name}>
                      <Link to={link} onClick={handleGamesLinkClick}>{name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>

        <div className="right flex a-center">
          <button
            className="logout-btn"
            onClick={() => {
              signOut(firebaseAuth);
            }}
          >
            <FaPowerOff />
          </button>
        </div>

        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </nav>
    </Container>
  );
}

export default Navbar;

const Container = styled.div`
  nav {
    position: fixed;
    top: 0;
    height: 68px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4%;
    z-index: 10;
    transition: background-color 0.3s ease-in-out;
    background: ${props => props.isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent'};
    background-image: ${props => props.isScrolled ? 'none' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0))'};
  }

  .scrolled {
    background: rgba(0, 0, 0, 0.9);
  }

  .left {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .brand {
    margin-right: 35px;
    
    img {
      height: 30px;
      width: auto;
    }
  }

  .links {
    list-style: none;
    display: flex;
    gap: 25px;
    margin: 0;
    padding: 0;
    align-items: center;

    li {
      position: relative;

      a, .games-title {
        color: #e5e5e5;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 0;
      }

      &:hover a, &:hover .games-title {
        color: #b3b3b3;
      }
    }

    .games-dropdown {
      position: relative;
      
      .dropdown-arrow {
        font-size: 14px;
        transition: transform 0.3s ease;
        
        &.open {
          transform: rotate(180deg);
        }
      }

      .dropdown {
        position: absolute;
        top: 100%;
        left: -10px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        list-style: none;
        padding: 10px 0;
        margin-top: 12px;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        z-index: 1000;

        &::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid rgba(255, 255, 255, 0.1);
        }

        li a {
          padding: 10px 18px;
          width: 100%;
          display: block;
          font-size: 15px;
          color: #e5e5e5;
          white-space: nowrap;
          text-decoration: none;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }
        }
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
  }

  .logout-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: color 0.3s ease;

    &:hover {
      color: #b3b3b3;
    }
  }

  .toast {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
    font-size: 16px;

    &.success {
      background: #2ecc71;
    }

    &.error {
      background: #e74c3c;
    }
  }
`;
// src/components/SeedTv.jsx
import React, { useEffect } from "react";
import { db } from "../utils/firebase-config";
import { doc, setDoc } from "firebase/firestore";

const SeedTv = () => {
  useEffect(() => {
    const seedTvShows = async () => {
      const tvShows = [
        { title: "Breaking Bad", year: 2008, genres: ["Crime", "Drama"], tmdbId: 1396, poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", description: "A high school chemistry teacher turned methamphetamine producer." },
        { title: "Stranger Things", year: 2016, genres: ["Drama", "Fantasy", "Horror"], tmdbId: 66732, poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg", description: "A group of kids uncover supernatural mysteries in their town." },
        { title: "The Witcher", year: 2019, genres: ["Action", "Adventure", "Fantasy"], tmdbId: 71912, poster: "https://image.tmdb.org/t/p/w500/zb1T1N8HlxW2jwJpZ78fqpU6DRK.jpg", description: "Geralt, a mutated monster-hunter, struggles to find his place in a world where people often prove more wicked than beasts." },
        { title: "Game of Thrones", year: 2011, genres: ["Action", "Adventure", "Drama"], tmdbId: 1399, poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg", description: "Nine noble families fight for control over Westeros, while an ancient enemy returns." },
        { title: "Friends", year: 1994, genres: ["Comedy", "Romance"], tmdbId: 1668, poster: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg", description: "Follows the personal and professional lives of six friends in New York City." },
        { title: "The Mandalorian", year: 2019, genres: ["Action", "Adventure", "Sci-Fi"], tmdbId: 82856, poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg", description: "A lone gunfighter makes his way through the outer reaches of the galaxy." },
        { title: "Money Heist", year: 2017, genres: ["Action", "Crime", "Drama"], tmdbId: 71446, poster: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg", description: "A criminal mastermind plans the biggest heist in history." },
        { title: "The Boys", year: 2019, genres: ["Action", "Comedy", "Crime"], tmdbId: 76479, poster: "https://image.tmdb.org/t/p/w500/5BLjtGAcxZ6Y6q0j2bh4Y3k2X4b.jpg", description: "A group of vigilantes set out to take down corrupt superheroes." },
        { title: "The Crown", year: 2016, genres: ["Drama", "History"], tmdbId: 65471, poster: "https://image.tmdb.org/t/p/w500/7Ggzbo2IE5Q0n1ng3Hx3xD3UQd.jpg", description: "Follows the political rivalries and romance of Queen Elizabeth II's reign." },
        { title: "Lucifer", year: 2016, genres: ["Crime", "Drama", "Fantasy"], tmdbId: 63174, poster: "https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg", description: "The Devil relocates to Los Angeles and opens a nightclub while helping the LAPD." },
        { title: "The Office", year: 2005, genres: ["Comedy"], tmdbId: 2316, poster: "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg", description: "A mockumentary on a group of typical office workers." },
        { title: "Sherlock", year: 2010, genres: ["Crime", "Drama", "Mystery"], tmdbId: 19885, poster: "https://image.tmdb.org/t/p/w500/f9zGxLHGyQB10cMDZNY5ZcGKhZi.jpg", description: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London." },
        { title: "Rick and Morty", year: 2013, genres: ["Animation", "Adventure", "Comedy"], tmdbId: 60625, poster: "https://image.tmdb.org/t/p/w500/qJdfO3ahgAMf2rcmhoqngjBBZW1.jpg", description: "An animated series that follows the exploits of a super scientist and his grandson." },
        { title: "Westworld", year: 2016, genres: ["Drama", "Mystery", "Sci-Fi"], tmdbId: 63247, poster: "https://image.tmdb.org/t/p/w500/4Pwy1i9oM1H7s8e0e9xS8Zp1cC2.jpg", description: "A dark odyssey about the dawn of artificial consciousness and the evolution of sin." },
        { title: "Black Mirror", year: 2011, genres: ["Drama", "Sci-Fi", "Thriller"], tmdbId: 60708, poster: "https://image.tmdb.org/t/p/w500/7ob5LGrkNYv5tyGNp9jL08QQrvG.jpg", description: "An anthology series exploring a twisted, high-tech multiverse." },
        { title: "Umbrella Academy", year: 2019, genres: ["Action", "Comedy", "Fantasy"], tmdbId: 82592, poster: "https://image.tmdb.org/t/p/w500/5YUYg5YpQW8awA4P9wpt7L4J6Hz.jpg", description: "A dysfunctional family of adopted superhero siblings reunite to solve the mystery of their father's death." },
        { title: "Vikings", year: 2013, genres: ["Action", "Adventure", "Drama"], tmdbId: 44217, poster: "https://image.tmdb.org/t/p/w500/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg", description: "The saga of Ragnar Lothbrok, a legendary Norse hero." },
        { title: "Dark", year: 2017, genres: ["Drama", "Mystery", "Sci-Fi"], tmdbId: 70523, poster: "https://image.tmdb.org/t/p/w500/od0xWfBdC5y9DPd3WqVb5fMlI1q.jpg", description: "A family saga with a supernatural twist, set in a German town." },
        { title: "Narcos", year: 2015, genres: ["Crime", "Drama"], tmdbId: 60625, poster: "https://image.tmdb.org/t/p/w500/1gHWNLkmOfbR9fRZV6nv7rEX7DS.jpg", description: "The rise and fall of the notorious Colombian drug lord Pablo Escobar." },
        { title: "The Flash", year: 2014, genres: ["Action", "Adventure", "Drama"], tmdbId: 60735, poster: "https://image.tmdb.org/t/p/w500/wdP6FrBfS6SOp3mNyrwF4y23Qsm.jpg", description: "Barry Allen uses his super speed to fight crime and solve mysteries." }
      ];

      try {
        for (let tv of tvShows) {
          const tvDoc = doc(db, "tv", tv.tmdbId.toString());
          await setDoc(tvDoc, tv);
        }
        alert("TV shows seeded successfully!");
      } catch (err) {
        console.error("Error seeding TV shows:", err);
      }
    };

    seedTvShows();
  }, []);

  return <div style={{ color: "white", margin: "20px" }}>Seeding TV shows...</div>;
};

export default SeedTv;

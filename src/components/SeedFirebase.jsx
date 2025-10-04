// src/components/SeedFirebase.jsx
import React, { useEffect } from "react";
import { db } from "../utils/firebase-config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const TMDB_API_KEY = "7b73a00bcdb4776989a1ccc50f41887a";

export default function SeedFirebase() {
  const movies = [
    { title: "Inception", year: 2010, genres: ["Action", "Sci-Fi", "Thriller"], category: "Trending", tmdbId: 27205, poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg", description: "A skilled thief is given a chance at redemption if he can successfully perform inception." },
    { title: "Forrest Gump", year: 1994, genres: ["Drama", "Romance"], category: "Trending", tmdbId: 13, poster: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from an Alabama man's perspective." },
    { title: "Shawshank Redemption", year: 1994, genres: ["Drama", "Crime"], category: "Trending", tmdbId: 278, poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
    { title: "Interstellar", year: 2014, genres: ["Adventure", "Drama", "Sci-Fi"], category: "Trending", tmdbId: 157336, poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
    { title: "Wonder Woman", year: 2017, genres: ["Action", "Adventure", "Fantasy"], category: "Trending", tmdbId: 297762, poster: "https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg", description: "Diana Prince discovers her full powers and true destiny as Wonder Woman." },
    { title: "Parasite", year: 2019, genres: ["Drama", "Thriller"], category: "Trending", tmdbId: 496243, poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", description: "A poor family schemes to become employed by a wealthy family and infiltrate their household." },
    { title: "Dune", year: 2021, genres: ["Sci-Fi", "Adventure"], category: "Trending", tmdbId: 438631, poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", description: "Paul Atreides journeys to the dangerous planet Arrakis to ensure the future of his family and people." },
    { title: "Spider-Man: No Way Home", year: 2021, genres: ["Action", "Adventure", "Sci-Fi"], category: "Trending", tmdbId: 634649, poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", description: "Spider-Man seeks help from Doctor Strange when his identity is revealed, causing the multiverse to open." },
    { title: "Top Gun: Maverick", year: 2022, genres: ["Action", "Drama"], category: "Trending", tmdbId: 361743, poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg", description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator." },

    // New Releases
    { title: "Frozen II", year: 2019, genres: ["Animation", "Adventure", "Family"], category: "New Releases", tmdbId: 330457, poster: "https://image.tmdb.org/t/p/w500/pjeMs3yqRmFL3giJy4PMXWZTTPa.jpg", description: "Elsa, Anna, Kristoff, and Olaf embark on a journey beyond Arendelle to discover the origin of Elsa's powers." },
    { title: "Aladdin", year: 2019, genres: ["Adventure", "Fantasy", "Family"], category: "New Releases", tmdbId: 22362, poster: "https://image.tmdb.org/t/p/w500/1dH0p3mFzp2HF4ANgGkeqq2gb7X.jpg", description: "A live-action retelling of the classic story of Aladdin and his magic lamp." },
    { title: "It Chapter Two", year: 2019, genres: ["Horror", "Thriller"], category: "New Releases", tmdbId: 474350, poster: "https://image.tmdb.org/t/p/w500/yp8vEZflGynlEylxEesbYasc06i.jpg", description: "The Losers' Club reunites 27 years later to confront Pennywise once again." },
    { title: "Coco", year: 2017, genres: ["Animation", "Family"], category: "New Releases", tmdbId: 354912, poster: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg", description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer." },
    { title: "Captain Marvel", year: 2019, genres: ["Action", "Adventure", "Sci-Fi"], category: "New Releases", tmdbId: 299537, poster: "https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg", description: "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war." },
    { title: "Encanto", year: 2021, genres: ["Animation", "Family", "Fantasy"], category: "New Releases", tmdbId: 568124, poster: "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg", description: "A Colombian teenage girl has to face the frustration of being the only member of her family without magical powers." },
    { title: "The Batman", year: 2022, genres: ["Action", "Crime", "Drama"], category: "New Releases", tmdbId: 414906, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues." },
    { title: "Turning Red", year: 2022, genres: ["Animation", "Family", "Comedy"], category: "New Releases", tmdbId: 508947, poster: "https://image.tmdb.org/t/p/w500/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg", description: "A 13-year-old girl turns into a giant red panda whenever she gets too excited." },
    { title: "Black Widow", year: 2021, genres: ["Action", "Adventure", "Sci-Fi"], category: "New Releases", tmdbId: 497698, poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg", description: "Natasha Romanoff confronts the darker parts of her ledger when a conspiracy ties to her past." },

    // Blockbusters
    { title: "The Dark Knight", year: 2008, genres: ["Action", "Crime", "Drama"], category: "Blockbusters", tmdbId: 155, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", description: "Batman faces the Joker, a criminal mastermind who thrusts Gotham into chaos." },
    { title: "Avengers: Endgame", year: 2019, genres: ["Action", "Adventure", "Superhero"], category: "Blockbusters", tmdbId: 299534, poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", description: "The Avengers assemble once more to undo Thanos' actions and restore balance." },
    { title: "Jurassic Park", year: 1993, genres: ["Adventure", "Action", "Sci-Fi"], category: "Blockbusters", tmdbId: 329, poster: "https://image.tmdb.org/t/p/w500/c414cDeQ9b6qLPLeKmiJuLDUREJ.jpg", description: "During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaurs to run amok." },
    { title: "The Godfather", year: 1972, genres: ["Crime", "Drama"], category: "Blockbusters", tmdbId: 238, poster: "https://image.tmdb.org/t/p/w500/eEslKSwcqmiNS6va24Pbxf2UKmJ.jpg", description: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son." },
    { title: "Gone Girl", year: 2014, genres: ["Thriller", "Drama"], category: "Blockbusters", tmdbId: 346364, poster: "https://image.tmdb.org/t/p/w500/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg", description: "A man becomes the focus of intense media scrutiny when his wife disappears." },
    { title: "Titanic", year: 1997, genres: ["Drama", "Romance"], category: "Blockbusters", tmdbId: 597, poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic." },
    { title: "The Lion King", year: 2019, genres: ["Adventure", "Drama", "Family"], category: "Blockbusters", tmdbId: 420818, poster: "https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg", description: "After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility." },
    { title: "Star Wars: The Force Awakens", year: 2015, genres: ["Action", "Adventure", "Sci-Fi"], category: "Blockbusters", tmdbId: 140607, poster: "https://image.tmdb.org/t/p/w500/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg", description: "Three decades after the Empire's defeat, a new threat arises in the militant First Order." },
    { title: "Gladiator", year: 2000, genres: ["Action", "Drama", "Adventure"], category: "Blockbusters", tmdbId: 98, poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family." },

    // Action
    { title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure", "Thriller"], category: "Action", tmdbId: 76341, poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", description: "Max teams up with Furiosa to flee from a cult leader in a post-apocalyptic wasteland." },
    { title: "Thor: Ragnarok", year: 2017, genres: ["Action", "Adventure", "Comedy"], category: "Action", tmdbId: 284053, poster: "https://image.tmdb.org/t/p/w500/kaIfm5ryEOwYg8mLbq8HkPuM1Fo.jpg", description: "Thor must escape the alien planet Sakaar to save Asgard from Hela." },
    { title: "Iron Man", year: 2008, genres: ["Action", "Adventure", "Sci-Fi"], category: "Action", tmdbId: 1726, poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", description: "Tony Stark builds a high-tech suit of armor to escape captivity and fight evil." },
    { title: "Black Panther", year: 2018, genres: ["Action", "Adventure", "Sci-Fi"], category: "Action", tmdbId: 284054, poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", description: "T'Challa returns home as king of Wakanda and must protect his kingdom." },
    { title: "Doctor Strange", year: 2016, genres: ["Action", "Adventure", "Fantasy"], category: "Action", tmdbId: 284052, poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg", description: "A neurosurgeon embarks on a journey of mysticism after a tragic accident." },
    { title: "John Wick", year: 2014, genres: ["Action", "Thriller"], category: "Action", tmdbId: 245891, poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog." },
    { title: "Mission: Impossible - Fallout", year: 2018, genres: ["Action", "Adventure", "Thriller"], category: "Action", tmdbId: 353081, poster: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg", description: "Ethan Hunt and his team race against time after a mission goes wrong." },
    { title: "Deadpool", year: 2016, genres: ["Action", "Comedy", "Adventure"], category: "Action", tmdbId: 293660, poster: "https://image.tmdb.org/t/p/w500/yGSxMiF0cYuAiyuve5DA6bnWEOI.jpg", description: "A wisecracking mercenary gets experimented on and becomes immortal but ugly." },
    { title: "Spider-Man: Into the Spider-Verse", year: 2018, genres: ["Action", "Adventure", "Animation"], category: "Action", tmdbId: 324857, poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", description: "Teen Miles Morales becomes Spider-Man and must help others from different dimensions fight a threat." },

    // Epics
    { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, genres: ["Adventure", "Fantasy"], category: "Epics", tmdbId: 120, poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", description: "A meek Hobbit and eight companions set out to destroy a powerful ring." },
    { title: "Se7en", year: 1995, genres: ["Crime", "Thriller", "Drama"], category: "Epics", tmdbId: 807, poster: "https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg", description: "Two detectives hunt a serial killer who uses the seven deadly sins as motives." },
    { title: "Pulp Fiction", year: 1994, genres: ["Crime", "Drama"], category: "Epics", tmdbId: 680, poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", description: "The lives of hitmen, a boxer, a gangster's wife, and diner bandits intertwine." },
    { title: "Harry Potter and the Sorcerer's Stone", year: 2001, genres: ["Adventure", "Fantasy", "Family"], category: "Epics", tmdbId: 671, poster: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", description: "An orphaned boy discovers he is a wizard and attends Hogwarts School." },
    { title: "The Matrix", year: 1999, genres: ["Action", "Sci-Fi"], category: "Epics", tmdbId: 603, poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", description: "A computer hacker learns the true nature of reality and his role in a war against its controllers." },
    { title: "The Lord of the Rings: The Return of the King", year: 2003, genres: ["Adventure", "Fantasy"], category: "Epics", tmdbId: 122, poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam." },
    { title: "Schindler's List", year: 1993, genres: ["Drama", "History", "War"], category: "Epics", tmdbId: 424, poster: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", description: "In German-occupied Poland, industrialist Oskar Schindler saves his Jewish employees from the Holocaust." },
    { title: "Braveheart", year: 1995, genres: ["Action", "Drama", "History"], category: "Epics", tmdbId: 197, poster: "https://image.tmdb.org/t/p/w500/or1gBugydmjToAEq7OZY0owwFk.jpg", description: "Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from English rule." },
    { title: "Oppenheimer", year: 2023, genres: ["Drama", "History"], category: "Epics", tmdbId: 872585, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb." },

    // All Movies
    { title: "A Quiet Place", year: 2018, genres: ["Drama", "Horror", "Thriller"], category: "All Movies", tmdbId: 520763, poster: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg", description: "A family is forced to live in silence while hiding from monsters with ultra-sensitive hearing." },
    { title: "Cinderella", year: 2015, genres: ["Fantasy", "Family", "Drama"], category: "All Movies", tmdbId: 300668, poster: "https://image.tmdb.org/t/p/w500/dh7R8Ck6xxNBSxLQJPj6jBzTqlD.jpg", description: "A live-action retelling of the classic fairy tale of Cinderella." },
    { title: "The Lion King", year: 1994, genres: ["Animation", "Adventure", "Family"], category: "All Movies", tmdbId: 8587, poster: "https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg", description: "Lion prince Simba flees his kingdom after his father is murdered, then returns to reclaim his throne." },
    { title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Drama"], category: "All Movies", tmdbId: 120467, poster: "https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRH4fzOq1VM1J.jpg", description: "A legendary concierge at a European hotel and his adventures with a lobby boy." },
    { title: "Toy Story", year: 1995, genres: ["Animation", "Adventure", "Comedy"], category: "All Movies", tmdbId: 862, poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", description: "A cowboy doll feels threatened when a new spaceman figure supplants him as top toy." },
    { title: "Avatar", year: 2009, genres: ["Adventure", "Fantasy", "Sci-Fi"], category: "All Movies", tmdbId: 19995, poster: "https://image.tmdb.org/t/p/w500/kmcqlZGaSh20zpTbuoF0Cdn07dT.jpg", description: "A paraplegic Marine is sent to the moon Pandora and becomes torn between following orders and protecting an alien civilization." },
    { title: "It", year: 2017, genres: ["Horror", "Thriller"], category: "All Movies", tmdbId: 346364, poster: "https://image.tmdb.org/t/p/w500/od5H1Ju00t9rPrT1E0cVn9aY5d9.jpg", description: "In the town of Derry, children begin disappearing after a mysterious clown appears." },
    { title: "La La Land", year: 2016, genres: ["Drama", "Music", "Romance"], category: "All Movies", tmdbId: 313369, poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", description: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles." },
    { title: "Whiplash", year: 2014, genres: ["Drama", "Music"], category: "All Movies", tmdbId: 244786, poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", description: "A promising young drummer enrolls at a music conservatory where he's mentored by a tyrannical instructor." },
    { title: "Get Out", year: 2017, genres: ["Horror", "Thriller"], category: "All Movies", tmdbId: 419430, poster: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg", description: "A young African-American visits his white girlfriend's parents for the weekend and uncovers a disturbing secret." },
    { title: "The Shape of Water", year: 2017, genres: ["Drama", "Fantasy", "Romance"], category: "All Movies", tmdbId: 399055, poster: "https://image.tmdb.org/t/p/w500/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg", description: "At a 1960s research facility, a mute janitor forms a unique relationship with an amphibious creature." },
    { title: "Knives Out", year: 2019, genres: ["Comedy", "Crime", "Mystery"], category: "All Movies", tmdbId: 546554, poster: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg", description: "A detective investigates the death of a patriarch of an eccentric, combative family." },
  ];

  useEffect(() => {
    const seedMovies = async () => {
      const moviesRef = collection(db, "movies");
      
      // Check each movie by tmdbId to avoid duplicates
      for (const movie of movies) {
        const q = query(moviesRef, where("tmdbId", "==", movie.tmdbId));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          await addDoc(moviesRef, movie);
          console.log(`Added: ${movie.title}`);
        } else {
          console.log(`Already exists: ${movie.title}`);
        }
      }
      
      console.log("All movies processed");
    };
    
    seedMovies();
  }, []);

  return <div>Seeding Firebase...</div>;
}
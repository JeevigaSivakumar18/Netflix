import React from "react";
import { useSelector } from "react-redux";
import CardSlider from "./CardSlider";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";


// categories constant removed — we derive categories from Firestore-loaded movies

function Slider() {
  const movies = useSelector((state) => state.netflix.movies);
  const loading = useSelector((state) => state.netflix.loading);
  const error = useSelector((state) => state.netflix.error);

  // Previously this component fetched multiple categories via external API.
  // With Firestore as the single backend we instead derive simple category
  // slices from the loaded `movies` array.

  // Debug log to see what data we have
  // minimal debug
  // console.log("Movies by category:", moviesByCategory);

  // derive simple categories from the firestore-loaded movies
  const all = Array.isArray(movies) ? movies : [];
  const trending = all.slice(0, 10);
  const newReleases = all.slice(10, 20);
  const blockbuster = all.slice(20, 30);
  const action = all.filter((m) => (m.genres || []).includes("Action")).slice(0, 10);
  const epics = all.filter((m) => (m.genres || []).includes("Epic")).slice(0, 10);

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      <CardSlider title="Trending" data={trending} />
      <CardSlider title="New Releases" data={newReleases} />
      <CardSlider title="Blockbuster Movies" data={blockbuster} />
      <CardSlider title="Action Movies" data={action} />
      <CardSlider title="Epics" data={epics} />
    </>
  );
}

export default Slider;
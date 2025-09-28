import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";

// Small sample dataset - poster/backdrop can be public assets or external URLs
const SAMPLE_MOVIES = [
  {
    id: "m1",
    name: "Sample Movie One",
    // placeholder external images (no storage)
    poster:
      "https://picsum.photos/seed/sample1/400/600",
    backdrop:
      "https://picsum.photos/seed/back1/1200/675",
    videoUrl: "/video.mp4",
    description: "A sample movie used for local development.",
    genres: ["Drama", "Mystery"],
  },
  {
    id: "m2",
    name: "Sample Movie Two",
    poster:
      "https://picsum.photos/seed/sample2/400/600",
    backdrop:
      "https://picsum.photos/seed/back2/1200/675",
    videoUrl: "/video.mp4",
    description: "Another sample movie with a local poster.",
    genres: ["Action"],
  },
];

export default function SeedFirebase() {
  const [busy, setBusy] = useState(false);
  const isDev = process.env.NODE_ENV !== "production";

  const handleSeed = async () => {
    if (!isDev) return;
    setBusy(true);
    try {
      const colRef = collection(db, "movies");
      for (const m of SAMPLE_MOVIES) {
        const docRef = doc(colRef, m.id);
        await setDoc(docRef, m);
      }
      console.debug("Seeded Firestore with sample movies");
      alert("Seeded Firestore with sample movies (dev only)");
    } catch (err) {
      console.error("Failed to seed Firestore:", err.message);
      alert("Failed to seed Firestore: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!isDev) return null;

  return (
    <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 2000 }}>
      <button onClick={handleSeed} disabled={busy} title="Seed Firestore (dev)">
        {busy ? "Seeding..." : "Seed Sample Movies"}
      </button>
    </div>
  );
}

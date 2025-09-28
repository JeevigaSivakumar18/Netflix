import { configureStore } from "@reduxjs/toolkit";
import netflixReducer from "./netflixSlice";
import genreReducer from "./genreSlice";
import myListReducer from "./myListSlice";
import { firebaseAuth, db } from "../utils/firebase-config";
import { doc, setDoc } from "firebase/firestore";


export const store = configureStore({
  reducer: {
    netflix: netflixReducer,
    genre: genreReducer,
    myList: myListReducer,
  },
});

// Persist myList to localStorage and attempt Firestore sync when signed in
let previousMyListJson = JSON.stringify(store.getState().myList || []);
// We'll debounce writes to Firestore slightly to avoid rapid-fire writes when many
// actions are dispatched in quick succession. The store subscriber remains the
// single writer for Firestore; thunks should no longer write directly.
let firestoreWriteTimer = null;
const FIRESTORE_DEBOUNCE_MS = 250; // small grouping window

store.subscribe(() => {
  const state = store.getState();
  const current = state.myList || [];
  const currentJson = JSON.stringify(current);
  if (previousMyListJson === currentJson) return; // no change

  // persist to localStorage immediately
  try {
    localStorage.setItem("myList", currentJson);
  } catch (err) {
    console.error("Failed to save myList to localStorage:", err.message);
  }

  // schedule a debounced Firestore write (single-writer)
  if (firestoreWriteTimer) clearTimeout(firestoreWriteTimer);
  firestoreWriteTimer = setTimeout(() => {
    try {
      const user = firebaseAuth?.currentUser;
      if (user && db) {
        const ref = doc(db, "users", user.uid);
        const payload = JSON.parse(currentJson);
        console.debug("Persisting myList to Firestore for user", user.uid, payload);
        setDoc(ref, { myList: payload }, { merge: true })
          .then(() => {
            console.debug("Firestore myList write successful");
            try {
              window.dispatchEvent(new CustomEvent("myListSync", { detail: { success: true } }));
            } catch (e) {
              /* ignore */
            }
          })
          .catch((e) => {
            console.warn("Failed to sync myList to Firestore:", e.message);
            try {
              window.dispatchEvent(new CustomEvent("myListSync", { detail: { success: false, error: e.message } }));
            } catch (e) {
              /* ignore */
            }
          });
      } else {
        console.debug("No user signed in — skipping Firestore write");
      }
    } catch (err) {
      console.warn("Firestore sync skipped:", err.message);
    }
    // update the previous JSON after attempting the write so we don't re-run unless changed
    previousMyListJson = currentJson;
    firestoreWriteTimer = null;
  }, FIRESTORE_DEBOUNCE_MS);
});

// ✅ Re-export thunks and actions
export * from "./netflixSlice";
export * from "./genreSlice";
export * from "./myListSlice";


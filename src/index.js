import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import {store} from "./store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, db } from "./utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { setList } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
        <App />
          </Provider>
    </React.StrictMode>
);

// Listen for Firebase auth changes and merge remote myList with local storage
try {
    onAuthStateChanged(firebaseAuth, async (user) => {
        if (!user) return; // no user, nothing to sync
        try {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            const remote = (snap.exists() && snap.data().myList) || [];
            const local = JSON.parse(localStorage.getItem("myList") || "[]");
            // Merge by id: include all remote, then add local items not present remotely
            const map = new Map();
            remote.forEach((m) => map.set(m.id, m));
            local.forEach((m) => {
                if (!map.has(m.id)) map.set(m.id, m);
            });
            const merged = Array.from(map.values());
            // dispatch to store; store subscriber will persist to localStorage and Firestore
            store.dispatch(setList(merged));
        } catch (err) {
            console.warn("Failed to merge myList from Firestore:", err.message);
        }
    });
} catch (err) {
    // If firebase isn't configured, continue silently
    // (firebaseAuth or db may be undefined in dev)
}
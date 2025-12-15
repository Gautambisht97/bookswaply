// pages/saved.js
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import ListingCard from "../components/ListingCard";

export default function Saved() {
  const [user, setUser] = useState(null);
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) return;

      const ref = collection(db, "users", u.uid, "saved");
      const snap = await getDocs(ref);

      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSavedListings(arr);
    });

    return () => unsub();
  }, []);

  if (!user)
    return <div className="card">Please sign in to view saved items.</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold">Saved Listings</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedListings.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No saved listings yet.
          </p>
        )}

        {savedListings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}

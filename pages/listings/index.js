// pages/listings/index.js
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import ListingCard from "../../components/ListingCard";

export default function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setListings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 dark:text-white">All Listings</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map(l => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}

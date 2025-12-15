// pages/edit-listing/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ProtectedRoute from "../../components/ProtectedRoute";
import ListingForm from "../../components/ListingForm";

export default function EditListing() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUid(u?.uid || null));
  }, []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "listings", id)).then((snap) => {
      if (snap.exists()) setListing(snap.data());
    });
  }, [id]);

  if (!listing) return <p className="text-center mt-10">Loading...</p>;

  return (
    <ProtectedRoute requiredRole="seller">
      <ListingForm initial={listing} userId={uid} listingId={id} />
    </ProtectedRoute>
  );
}

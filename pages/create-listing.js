// pages/create-listing.js
import ProtectedRoute from "../components/ProtectedRoute";
import ListingForm from "../components/ListingForm";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

/**
 * Only accessible to signed-in users (sellers should be able to create after KYC approved in practice).
 * For demo we only require signed-in.
 */

export default function CreateListingPage() {
  const [uid, setUid] = useState(null);
  useEffect(()=> {
    const unsub = onAuthStateChanged(auth, (u)=> setUid(u?.uid || null));
    return ()=> unsub();
  }, []);
  return (
    <ProtectedRoute>
      <div>
        <ListingForm userId={uid} />
      </div>
    </ProtectedRoute>
  );
}

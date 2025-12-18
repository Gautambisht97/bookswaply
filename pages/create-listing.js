// pages/create-listing.js
import ProtectedRoute from "../components/ProtectedRoute";
import ListingForm from "../components/ListingForm";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Seller-only route
 * - Logged out → handled by ProtectedRoute
 * - Logged in non-seller → redirected
 * - Seller → allowed
 */

export default function CreateListingPage() {
  const [uid, setUid] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setChecking(false);
        return;
      }

      setUid(u.uid);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));

        // if not seller → block access
        if (!snap.exists() || snap.data().role !== "seller") {
          router.replace("/user/dashboard");
          return;
        }
      } catch (err) {
        console.error("Seller check failed:", err);
        router.replace("/user/dashboard");
      }

      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  // Prevent UI flash while checking role
  if (checking) return null;

  return (
    <ProtectedRoute>
      <div>
        <ListingForm userId={uid} />
      </div>
    </ProtectedRoute>
  );
}

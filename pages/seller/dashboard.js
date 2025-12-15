import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import ListingCard from "../../components/ListingCard";
import KYCForm from "../../components/KYCForm";
import Link from "next/link";

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const uref = doc(db, "users", u.uid);
      const usnap = await getDoc(uref);
      const data = usnap.exists() ? usnap.data() : null;
      setUserDoc(data);

      if (data?.role === "seller") {
        const q = query(
          collection(db, "listings"),
          where("sellerId", "==", u.uid)
        );
        const snap = await getDocs(q);
        setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    });

    return () => unsub();
  }, []);

  if (!userDoc) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-serif font-bold">
          Seller Dashboard
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Sell books, complete KYC, and manage your listings
        </p>

        {/* KYC STATUS */}
        <div className="mt-6 card">
          <h2 className="text-lg font-semibold mb-2">KYC Status</h2>

          {userDoc.kyc?.status === "approved" && (
            <p className="text-green-600">✅ KYC Approved</p>
          )}

          {userDoc.kyc?.status === "pending" && (
            <p className="text-yellow-600">⏳ KYC Pending</p>
          )}

          {!userDoc.kyc && (
            <p className="text-red-600">❌ KYC not submitted</p>
          )}

          {userDoc.kyc?.status !== "approved" && (
            <div className="mt-4">
              <KYCForm userDoc={{ ...userDoc, uid: user.uid }} />
            </div>
          )}
        </div>

        {/* LISTINGS */}
        {userDoc.role === "seller" && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Listings</h2>

              <Link href="/create-listing" className="btn-primary">
                + Add Book
              </Link>
            </div>

            {listings.length === 0 ? (
              <p className="text-zinc-600">No listings yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

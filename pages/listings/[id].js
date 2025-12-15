import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "../../components/ToastProvider";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { showToast } = useToast(); // ✅ CORRECT
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

  /* ---------- LOAD LISTING ---------- */
  useEffect(() => {
    if (!id) return;

    async function load() {
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }
    }

    load();
  }, [id]);

  /* ---------- LOAD USER + SAVED ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u && id) {
        const { isListingSaved } = await import("../../lib/save");
        setSaved(await isListingSaved(u.uid, id));
      }
    });

    return () => unsub();
  }, [id]);

  /* ---------- CONTACT SELLER ---------- */
  const contactSeller = async () => {
    if (!user) {
      showToast("Please sign in to contact seller", "error");
      return router.push("/auth/signin");
    }

    if (user.uid === listing.sellerId) {
      return showToast("You cannot contact yourself", "error");
    }

    try {
      const chatRef = await addDoc(collection(db, "chats"), {
        buyerId: user.uid,
        sellerId: listing.sellerId,
        listingId: listing.id,
        createdAt: new Date(),
      });

      await addDoc(collection(db, "chats", chatRef.id, "messages"), {
        from: user.uid,
        text: `Hi, I'm interested in "${listing.title}". Is it still available?`,
        createdAt: new Date(),
      });

      router.push(`/chat/${chatRef.id}`);
    } catch {
      showToast("Could not start chat", "error");
    }
  };

  /* ---------- SAVE / UNSAVE ---------- */
  const toggleSave = async () => {
    if (!user) {
      showToast("Please sign in to save listings", "error");
      return router.push("/auth/signin");
    }

    const { saveListing, unsaveListing } = await import("../../lib/save");

    try {
      if (saved) {
        await unsaveListing(user.uid, id);
        setSaved(false);
        showToast("Removed from saved");
      } else {
        await saveListing(user.uid, listing);
        setSaved(true);
        showToast("Saved successfully");
      }
    } catch {
      showToast("Failed to save listing", "error");
    }
  };

  if (!listing) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const isOwner = user && user.uid === listing.sellerId;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 pt-6">

      {/* IMAGE */}
      <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
        <img
          src={listing.images?.[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="mt-6 p-6 rounded-xl shadow-lg bg-white dark:bg-neutral-800 border border-zinc-200 dark:border-neutral-700">

        <h1 className="text-3xl font-bold">{listing.title}</h1>

        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {listing.author} • {listing.condition}
        </p>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          {listing.description}
        </p>

        <p className="mt-4 font-bold text-2xl text-blue-600 dark:text-blue-400">
          ₹{listing.priceText}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          City: {listing.city}
        </p>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">

          {!isOwner && (
            <>
              <button
                onClick={contactSeller}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Contact Seller
              </button>

              <button
                onClick={toggleSave}
                className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-lg"
              >
                {saved ? "Unsave" : "Save"}
              </button>
            </>
          )}

          {isOwner && (
            <span className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">
              This is your listing
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

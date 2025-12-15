import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function SellerChats() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const q = query(
        collection(db, "chats"),
        where("sellerId", "==", u.uid)
      );

      const snap = await getDocs(q);
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Buyer Messages</h1>

        {chats.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {chats.map(chat => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block card hover:shadow-lg transition"
              >
                <p className="font-semibold">
                  Listing ID: {chat.listingId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Buyer ID: {chat.buyerId}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

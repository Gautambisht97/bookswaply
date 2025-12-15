// pages/inbox.js
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Inbox() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return;

      // buyer chats
      const buyerQuery = query(
        collection(db, "chats"),
        where("buyerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );

      // seller chats
      const sellerQuery = query(
        collection(db, "chats"),
        where("sellerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );

      const [buyerSnap, sellerSnap] = await Promise.all([
        getDocs(buyerQuery),
        getDocs(sellerQuery),
      ]);

      const allChats = [
        ...buyerSnap.docs,
        ...sellerSnap.docs,
      ].map((d) => ({ id: d.id, ...d.data() }));

      // remove duplicates
      const unique = Object.values(
        Object.fromEntries(allChats.map(c => [c.id, c]))
      );

      setChats(unique);
    });

    return () => unsub();
  }, []);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-2xl font-serif font-bold mb-6">
          Messages
        </h1>

        {chats.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No conversations yet.
          </p>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block card hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
              >
                <p className="font-semibold">
                  Listing ID:{" "}
                  <span className="text-sm text-gray-500">
                    {chat.listingId}
                  </span>
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chat.buyerId === user.uid
                    ? "You contacted seller"
                    : "Buyer contacted you"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

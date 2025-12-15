// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState([]);

  // Load latest books
  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "listings"),
        orderBy("createdAt", "desc"),
        limit(8)
      );
      const snap = await getDocs(q);
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-[#1c1c1c] dark:to-[#2a2a2a]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
            Discover & Exchange Books with Ease 📚
          </h1>

          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Buy, sell, and find your next favorite read at the best price.
            A simple marketplace for book lovers.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow transition"
            >
              Get Started
            </Link>

            <Link
              href="/listings"
              className="px-6 py-3 border border-gray-700 dark:border-gray-300 rounded-lg
              text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST BOOKS */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
          Latest Books
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Newly added books from sellers near you.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No books yet.</p>
          ) : (
            listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/listings"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow transition"
          >
            Browse All Listings →
          </Link>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-6xl mx-auto px-6 py-20 mt-16">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-gray-100">
          Why BookSwaply?
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="text-center p-6 bg-white dark:bg-[#1f1f1f] rounded-xl shadow">
            <div className="text-4xl">📦</div>
            <h3 className="mt-4 text-xl font-bold">Buy & Sell Easily</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Simple, fast and secure way to exchange books.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-[#1f1f1f] rounded-xl shadow">
            <div className="text-4xl">💸</div>
            <h3 className="mt-4 text-xl font-bold">Save Money</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Get books for half the price of new ones.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-[#1f1f1f] rounded-xl shadow">
            <div className="text-4xl">📚</div>
            <h3 className="mt-4 text-xl font-bold">More Books, Less Waste</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Give books a second life instead of throwing them away.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

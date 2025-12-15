// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  // Auth + user role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setUserDoc(snap.exists() ? snap.data() : null);
      } else {
        setUserDoc(null);
      }
    });
    return () => unsub();
  }, []);

  // Theme load
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // 🔥 SELL BUTTON LOGIC (FIXED)
  const handleSellClick = () => {
    // 1️⃣ Not logged in
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    // 2️⃣ User doc not loaded yet OR not seller OR KYC not approved
    if (
      !userDoc ||
      userDoc.role !== "seller" ||
      userDoc.kyc?.status !== "approved"
    ) {
      router.push("/seller/dashboard");
      return;
    }

    // 3️⃣ Seller + KYC approved
    router.push("/create-listing");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 rounded-b-xl border border-white/30 dark:border-neutral-800/40 shadow-md backdrop-blur bg-white/70 dark:bg-neutral-900/70">
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-serif text-zinc-900 dark:text-white">
              BookSwaply
            </Link>

            <Link
              href="/listings"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition"
            >
              Browse
            </Link>

            {/* ✅ SELL BUTTON (SMART) */}
            <button
              onClick={handleSellClick}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
              bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            >
              + Sell
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-zinc-200 dark:bg-neutral-700"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* 📩 MESSAGES */}
            {user && (
              <Link
                href="/inbox"
                className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition"
              >
                Messages
              </Link>
            )}

            <Link href="/saved" className="text-sm">
              Saved
            </Link>

            {user ? (
              <>
                <Link href="/user/dashboard" className="btn-primary">
                  Dashboard
                </Link>

                <button onClick={() => signOut(auth)} className="btn-ghost">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-primary">
                Sign in
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

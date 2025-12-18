// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // auth + role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setRole(snap.data().role); // "user" | "seller" | "admin"
        }
      } else {
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  // theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-zinc-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/" className="text-xl font-serif font-bold">
          BookSwaply
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/listings" className="nav-link">Browse</Link>

          {/* SELL — ONLY SELLERS */}
          {user && role === "seller" && (
            <Link
              href="/create-listing"
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white"
            >
              + Sell
            </Link>
          )}

          <button onClick={toggleTheme} className="p-2 rounded-md bg-zinc-200 dark:bg-neutral-700">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user && <Link href="/inbox" className="nav-link">Messages</Link>}
          <Link href="/saved" className="nav-link">Saved</Link>

          {user ? (
            <>
              <Link href="/user/dashboard" className="btn-primary">Dashboard</Link>
              <button onClick={() => signOut(auth)} className="btn-ghost">Sign out</button>
            </>
          ) : (
            <Link href="/auth/signin" className="btn-primary">Sign in</Link>
          )}
        </div>

        {/* MOBILE */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md bg-zinc-200">
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 py-4 space-y-3">
          <Link href="/listings" onClick={()=>setOpen(false)}>Browse</Link>

          {user && role === "seller" && (
            <Link href="/create-listing" onClick={()=>setOpen(false)}>Sell Book</Link>
          )}

          {user && <Link href="/inbox" onClick={()=>setOpen(false)}>Messages</Link>}
          <Link href="/saved" onClick={()=>setOpen(false)}>Saved</Link>

          {user ? (
            <>
              <Link href="/user/dashboard" onClick={()=>setOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut(auth)}>Sign out</button>
            </>
          ) : (
            <Link href="/auth/signin" onClick={()=>setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}

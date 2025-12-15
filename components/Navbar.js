// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
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

        {/* LEFT */}
        <Link href="/" className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
          BookSwaply
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/listings" className="nav-link">Browse</Link>

          <Link
            href="/create-listing"
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            + Sell
          </Link>

          <button onClick={toggleTheme} className="p-2 rounded-md bg-zinc-200 dark:bg-neutral-700">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user && (
            <Link href="/inbox" className="nav-link">
              Messages
            </Link>
          )}

          <Link href="/saved" className="nav-link">Saved</Link>

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

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md bg-zinc-200 dark:bg-neutral-700"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-zinc-200 dark:border-neutral-800 px-4 py-4 space-y-3">
          <Link href="/listings" className="block nav-link" onClick={()=>setOpen(false)}>
            Browse
          </Link>

          <Link href="/create-listing" className="block nav-link" onClick={()=>setOpen(false)}>
            Sell Book
          </Link>

          {user && (
            <Link href="/inbox" className="block nav-link" onClick={()=>setOpen(false)}>
              Messages
            </Link>
          )}

          <Link href="/saved" className="block nav-link" onClick={()=>setOpen(false)}>
            Saved
          </Link>

          <button onClick={toggleTheme} className="block nav-link">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {user ? (
            <>
              <Link href="/user/dashboard" className="block nav-link" onClick={()=>setOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut(auth);
                  setOpen(false);
                }}
                className="block nav-link text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="block nav-link" onClick={()=>setOpen(false)}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

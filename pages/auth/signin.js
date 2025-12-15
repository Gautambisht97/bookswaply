// pages/auth/signin.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  // load dark mode preference
  useEffect(() => {
    const val = localStorage.getItem("bs_dark") === "1";
    setDark(val);
    if (val) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("bs_dark", next ? "1" : "0");
  }

  // If already logged in, redirect based on role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        if (data?.role === "seller") router.replace("/seller/dashboard");
        else router.replace("/");
      } catch (err) {
        router.replace("/");
      }
    });
    return () => unsub();
  }, [router]);

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;
      if (data?.role === "seller") router.replace("/seller/dashboard");
      else router.replace("/");
    } catch (err) {
      alert("Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // ensure user doc exists
      const u = result.user;
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;
      if (data?.role === "seller") router.replace("/seller/dashboard");
      else router.replace("/");
    } catch (err) {
      alert("Google Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between mb-6 items-center">
          <div className="text-lg font-semibold">BookSwaply</div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDark}
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 text-sm"
            >
              {dark ? "Dark" : "Light"}
            </button>
            <Link href="/auth/signup" className="px-3 py-1 rounded-md border text-sm">
              Sign Up
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          {/* LEFT: form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">Log in</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Sign in to manage your account, contact sellers, and save listings.
            </p>

            <form onSubmit={handleSignin} className="space-y-4">
              <div>
                <label className="text-sm block mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-3 rounded-md border bg-gray-50 dark:bg-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm block mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full p-3 rounded-md border bg-gray-50 dark:bg-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-md font-medium"
              >
                {loading ? "Signing in…" : "Log in"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-300">Or sign in with</div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <button
                onClick={googleLogin}
                disabled={loading}
                className="w-full border rounded-md py-2 px-3 flex items-center justify-center space-x-3 bg-white dark:bg-gray-700"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" className="inline-block">
                  <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C34.6 32 30 35.9 24 35.9c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l5.6-5.6C33.9 5.6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.3-.1-2.6-.4-3.9z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-emerald-600 dark:text-emerald-400 font-medium">
                Create account
              </Link>
            </div>
          </div>

          {/* RIGHT: illustration */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Welcome to BookSwaply</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Buy and sell pre-loved books in your city. Safe, simple, and local.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {/* Illustration — replace URL if you want your own */}
                <img
                  src="/ChatGPT Image Dec 13, 2025, 12_28_41 AM.png"
                  alt="Book illustration"
                  className="w-64 mx-auto mb-6 drop-shadow-lg"
                  draggable="false"
                />

              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

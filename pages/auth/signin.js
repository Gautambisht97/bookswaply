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
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    const val = localStorage.getItem("bs_dark") === "1";
    setDark(val);
    document.documentElement.classList.toggle("dark", val);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bs_dark", next ? "1" : "0");
  }

  /* ---------------- ROLE REDIRECT HELPER ---------------- */
  const redirectByRole = (role) => {
    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "seller") router.replace("/seller/dashboard");
    else router.replace("/user/dashboard");
  };

  /* ---------------- AUTO REDIRECT IF LOGGED IN ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;

      redirectByRole(data?.role);
    });

    return () => unsub();
  }, [router]);

  /* ---------------- EMAIL LOGIN ---------------- */
  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;

      redirectByRole(data?.role);
    } catch (err) {
      alert("Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- GOOGLE LOGIN ---------------- */
  async function googleLogin() {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      // If user doc does not exist → create normal user
      if (!snap.exists()) {
        await setDoc(ref, {
          email: u.email,
          role: "user",
          createdAt: new Date(),
        });
        redirectByRole("user");
      } else {
        redirectByRole(snap.data().role);
      }
    } catch (err) {
      alert("Google Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */
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
          {/* LEFT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">Log in</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Sign in to manage your account, contact sellers, and save listings.
            </p>

            <form onSubmit={handleSignin} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full p-3 rounded-md border bg-gray-50 dark:bg-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                required
                placeholder="Password"
                className="w-full p-3 rounded-md border bg-gray-50 dark:bg-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-md font-medium"
              >
                {loading ? "Signing in…" : "Log in"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-300">
              Or sign in with
            </div>

            <button
              onClick={googleLogin}
              disabled={loading}
              className="mt-3 w-full border rounded-md py-2 px-3 bg-white dark:bg-gray-700"
            >
              Continue with Google
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md text-center">
              <h3 className="text-lg font-semibold">Welcome to BookSwaply</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Buy and sell pre-loved books in your city.
              </p>
              <img
                src="/ChatGPT Image Dec 13, 2025, 12_28_41 AM.png"
                alt="Books"
                className="w-64 mx-auto mt-6"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

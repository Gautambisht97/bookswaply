// pages/auth/admin.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if admin already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();

      if (data?.role === "admin") {
        router.replace("/admin/dashboard");
      }
    });

    return () => unsub();
  }, []);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // sign in
      const result = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "users", result.user.uid);
      const snap = await getDoc(ref);

      // not admin?
      if (!snap.exists() || snap.data().role !== "admin") {
        alert("You are NOT an admin.");
        return;
      }

      router.replace("/admin/dashboard");
    } catch (err) {
      alert("Admin login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 card">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>

      <form onSubmit={handleAdminLogin}>
        <label className="text-sm">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn w-full" disabled={loading}>
          {loading ? "Checking..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}

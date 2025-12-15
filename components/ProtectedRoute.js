// components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children, requiredRole }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // NOT LOGGED IN → Redirect ONLY for protected pages
      if (!user) {
        router.replace("/auth/signin");
        return;
      }

      // Fetch user data
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;

      // Role check → Redirect if needed
      if (requiredRole && data?.role !== requiredRole) {
        router.replace("/");
        return;
      }

      setChecking(false);
    });

    return () => unsub();
  }, []);

  if (checking) return <p className="text-center mt-10">Loading...</p>;
  return children;
}

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, "users", userCred.user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().role === "admin") {
        router.push("/admin/dashboard");
      } else {
        alert("Not an admin.");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="card max-w-sm mx-auto mt-10" onSubmit={login}>
      <h1 className="text-lg font-bold">Admin Login</h1>

      <input
        className="mt-3 card p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="mt-2 card p-2 w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn mt-4 w-full">Login</button>
    </form>
  );
}

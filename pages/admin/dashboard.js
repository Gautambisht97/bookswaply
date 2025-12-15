// pages/admin/dashboard.js
import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

/**
 * Admin dashboard: view users with kyc.status == "pending" and approve/reject.
 * For demo purposes, assign role 'admin' manually in Firestore to a user.
 */

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);

  useEffect(()=> {
    async function load() {
      const q = query(collection(db, "users"), where("kyc.status", "==", "pending"));
      const snap = await getDocs(q);
      setPending(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  async function setStatus(uid, status) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { "kyc.status": status, updatedAt: new Date() });
    // refresh
    const q = query(collection(db, "users"), where("kyc.status", "==", "pending"));
    const snap = await getDocs(q);
    setPending(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="mt-4">
          <h2 className="font-semibold">Pending KYC</h2>
          {pending.length === 0 && <p className="text-sm text-gray-600 mt-2">No pending KYC.</p>}
          <div className="mt-2 space-y-4">
            {pending.map(u => (
              <div key={u.id} className="card">
                <p><strong>{u.email || u.uid}</strong></p>
                <div className="mt-2">
                  {u.kyc?.images?.map((img, idx) => <img key={idx} src={img} className="w-48 h-32 object-cover mr-2 inline-block" />)}
                </div>
                <div className="mt-3">
                  <button className="btn mr-2" onClick={()=>setStatus(u.id, "approved")}>Approve</button>
                  <button className="small-btn" onClick={()=>setStatus(u.id, "rejected")}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

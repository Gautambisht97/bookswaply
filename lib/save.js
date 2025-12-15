// lib/save.js
import { db } from "./firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

// Save book
export async function saveListing(userId, listing) {
  const ref = doc(db, "users", userId, "saved", listing.id);

  await setDoc(ref, {
    id: listing.id,
    title: listing.title,
    author: listing.author,
    city: listing.city,
    priceText: listing.priceText,
    images: listing.images || [],
    savedAt: new Date()
  });
}

// Remove saved book
export async function unsaveListing(userId, listingId) {
  const ref = doc(db, "users", userId, "saved", listingId);
  await deleteDoc(ref);
}

// Check if saved
export async function isListingSaved(userId, listingId) {
  const ref = doc(db, "users", userId, "saved", listingId);
  const snap = await getDoc(ref);
  return snap.exists();
}

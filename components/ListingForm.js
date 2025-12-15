import { useState } from "react";
import { uploadToCloudinary } from "../lib/cloudinary";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/router";
import { useToast } from "./ToastProvider";

export default function ListingForm({ initial = {}, userId }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: initial.title || "",
    author: initial.author || "",
    condition: initial.condition || "",
    description: initial.description || "",
    priceText: initial.priceText || "",
    city: initial.city || "",
  });

  const [images, setImages] = useState(initial.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // IMAGE UPLOAD
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const res = await uploadToCloudinary(file);
        setImages((prev) => [...prev, res.secure_url]);
      }
      showToast("Images uploaded", "success");
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 HARD GUARD (IMPORTANT)
    if (!userId) {
      return showToast("You must be signed in", "error");
    }

    if (images.length === 0) {
      return showToast("Upload at least one image", "error");
    }

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "listings"), {
        ...form,
        images,
        sellerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      showToast("Listing created successfully", "success");
      router.push(`/listings/${docRef.id}`);
    } catch {
      showToast("Failed to create listing", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Create Listing</h2>

      {/* TEXT FIELDS */}
      {[
        ["Title", "title"],
        ["Author", "author"],
        ["Condition", "condition"],
        ["Price", "priceText"],
        ["City", "city"],
      ].map(([label, key]) => (
        <label key={key} className="block">
          <span className="text-sm font-medium">{label}</span>
          <input
            required
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full mt-1 p-2 rounded border dark:bg-neutral-900"
          />
        </label>
      ))}

      <label className="block">
        <span className="text-sm font-medium">Description</span>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-1 p-2 rounded border dark:bg-neutral-900"
        />
      </label>

      {/* IMAGE UPLOAD */}
      <label className="block">
        <span className="text-sm font-medium">
          Book Images <span className="text-red-500">*</span>
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageFiles}
          className="mt-1"
        />
        {images.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            At least one image is required
          </p>
        )}
      </label>

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={uploading || submitting || images.length === 0}
        className={`btn-primary w-full ${
          images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading
          ? "Uploading images..."
          : submitting
          ? "Creating listing..."
          : "Create Listing"}
      </button>
    </form>
  );
}

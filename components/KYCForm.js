import { useState } from "react";
import { uploadToCloudinary } from "../lib/cloudinary";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useToast } from "./ToastProvider";

export default function KYCForm({ userDoc }) {
  const { showToast } = useToast();

  const existingStatus = userDoc?.kyc?.status;

  // 🚫 BLOCK CONDITIONS
  const isBlocked =
    existingStatus === "pending" || existingStatus === "approved";

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // IMAGE UPLOAD
  const handleFiles = async (e) => {
    if (isBlocked) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const res = await uploadToCloudinary(file);
        setImages((prev) => [...prev, res.secure_url]);
      }
      showToast("KYC images uploaded", "success");
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // SUBMIT KYC
  const submitKYC = async () => {
    // 🔒 HARD GUARD
    if (isBlocked) {
      return showToast(
        "You already have a KYC request in progress",
        "error"
      );
    }

    if (images.length === 0) {
      return showToast("Upload at least one ID image", "error");
    }

    setSubmitting(true);
    try {
      await updateDoc(doc(db, "users", userDoc.uid), {
        kyc: {
          status: "pending",
          images,
          submittedAt: serverTimestamp(),
        },
      });

      showToast("KYC submitted for verification", "success");
    } catch {
      showToast("Failed to submit KYC", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Seller KYC Verification</h3>

      {/* STATUS MESSAGE */}
      {existingStatus === "approved" && (
        <p className="text-green-600 font-medium">
          ✅ Your KYC is approved
        </p>
      )}

      {existingStatus === "pending" && (
        <p className="text-yellow-600 font-medium">
          ⏳ Your KYC is under review
        </p>
      )}

      {existingStatus === "rejected" && (
        <p className="text-red-600 font-medium">
          ❌ KYC rejected. Please re-submit.
        </p>
      )}

      {/* UPLOAD FIELD */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={isBlocked}
        className={isBlocked ? "opacity-50 cursor-not-allowed" : ""}
      />

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

      {/* SUBMIT BUTTON */}
      {!isBlocked && (
        <button
          onClick={submitKYC}
          disabled={uploading || submitting || images.length === 0}
          className={`btn-primary ${
            images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading
            ? "Uploading..."
            : submitting
            ? "Submitting..."
            : "Submit KYC"}
        </button>
      )}
    </div>
  );
}

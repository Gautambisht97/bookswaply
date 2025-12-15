/**
 * lib/cloudinary.js
 * Simple client-side unsigned upload helper to Cloudinary.
 *
 * You MUST set these env vars:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
 *
 * How unsigned upload works (demo): client posts image file to Cloudinary endpoint
 * using the unsigned preset name you create in Cloudinary settings.
 *
 * IMPORTANT: unsigned uploads are for demo only. For production use signed uploads from a server.
 */

export async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary env variables. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET"
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset); // unsigned preset name

  const res = await fetch(url, {
    method: "POST",
    body: data
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Cloudinary upload failed: " + text);
  }
  const json = await res.json();
  // returns object with secure_url, public_id, etc.
  return json;
}

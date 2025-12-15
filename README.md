# SecondHand Books Marketplace (Demo MVP)

**Goal:** Minimal demo-ready marketplace to browse second-hand books, allow sellers to upload KYC and listings, allow users to contact sellers. Deployable on Vercel. Frontend: Next.js. Backend: Firebase (Auth + Firestore). Images: Cloudinary unsigned uploads (demo).

---

## Quick environment variable checklist (names only)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET

---

## 1) Clone / create project folder and install

Open a terminal and run these exact commands:

```bash
# create folder and enter
mkdir secondhand-books-marketplace
cd secondhand-books-marketplace

# initialize with package.json & files provided above (you've already copied files)
# now install dependencies:
npm install

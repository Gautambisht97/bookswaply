import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
          User Dashboard
        </h1>

        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Browse books, save your favorites, or start selling your own books.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Browse books */}
          <button
            onClick={() => router.push("/listings")}
            className="card hover:shadow-lg transition text-left"
          >
            <h2 className="text-lg font-semibold">📚 Browse Books</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Explore books listed by sellers near you.
            </p>
          </button>

          {/* SELL BOOK — FIXED */}
          <button
            onClick={() => router.push("/seller/dashboard")}
            className="card hover:shadow-lg transition text-left"
          >
            <h2 className="text-lg font-semibold">💼 Sell Books</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Become a seller, complete KYC, and list your books.
            </p>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// components/ListingCard.js
import Link from "next/link";

export default function ListingCard({ listing }) {
  const img = listing.images?.[0] || "/fallback-book.jpg";

  return (
    <article className="
      bg-white dark:bg-neutral-900 
      rounded-xl shadow-md hover:shadow-xl 
      border border-zinc-200 dark:border-neutral-700
      transition transform hover:scale-[1.02]
      overflow-hidden
    ">
      
      {/* IMAGE */}
      <div className="w-full h-52 bg-white p-3 flex items-center justify-center">
        <img
          src={img}
          alt={listing.title}
          className="max-h-full max-w-full object-contain rounded-md"
        />
      </div>

      {/* TEXT CONTENT */}
      <div className="px-4 py-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {listing.title}
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          {listing.author} • <span className="text-xs">{listing.city}</span>
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
            ₹{listing.priceText}
          </span>

          <Link
            href={`/listings/${listing.id}`}
            className="
              px-3 py-1 rounded-md text-sm
              bg-blue-600 hover:bg-blue-700 
              dark:bg-blue-500 dark:hover:bg-blue-600
              text-white shadow
            "
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

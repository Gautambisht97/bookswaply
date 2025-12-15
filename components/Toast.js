// components/Toast.js
export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div
      className="
        fixed bottom-6 right-6 z-50
        bg-green-600 text-white
        px-6 py-3 rounded-lg shadow-xl
        animate-toast
      "
    >
      {message}
    </div>
  );
}

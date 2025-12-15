// components/Footer.js
export default function Footer(){
  return (
    <footer className="mt-12 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
      <div className="site-container mx-auto">
        <p>© {new Date().getFullYear()} BookSwaply — A cozy community marketplace for used books.</p>
        <p className="mt-2">Made with ❤️ · Privacy-friendly · No payments (demo)</p>
      </div>
    </footer>
  );
}

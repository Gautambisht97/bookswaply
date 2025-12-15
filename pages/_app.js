// pages/_app.js
import "../styles/tailwind.css";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { ToastProvider } from "../components/ToastProvider";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const hideNavbarOn = ["/auth/signin", "/auth/signup"];
  const shouldHideNavbar = hideNavbarOn.includes(router.pathname);

  return (
    <ToastProvider>
      {!shouldHideNavbar && <Navbar />}
      <main className="pt-28">
        <div className="container">
          <Component {...pageProps} />
        </div>
      </main>
    </ToastProvider>
  );
}

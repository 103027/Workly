import Navbar from "@/components/layout/Navbar";
import { AuthenticationContextProvider } from "@/store/AuthContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthenticationContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </AuthenticationContextProvider>
    </>
  );
}

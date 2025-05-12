import Navbar from "@/components/layout/Navbar";
import { AuthenticationContextProvider } from "@/store/AuthContext";
import { NotificationProvider } from '@/store/NotificationContext';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NotificationProvider>
        <AuthenticationContextProvider>
          <Navbar />
          <Component {...pageProps} />
        </AuthenticationContextProvider>
      </NotificationProvider>
    </>
  );
}

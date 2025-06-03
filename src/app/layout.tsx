import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Toaster } from "sonner";
import { Provider, useSelector } from "react-redux";
import { RootState } from "../lib/store";
// import { useEffect } from "react";
import { fetchSettings } from "../lib/AllSlices/settingsSlice";
import Providers from "../lib/providers";
import { getServerSession } from "next-auth";
import StoreProvider from "../lib/storeProvider";
import { getSettings } from "../lib/repos/settings";
import { SearchProductsData } from "../lib/repos/productsRepo";
import { getHomeFooter } from "../lib/repos/footer";
import { getHeaderTop } from "../lib/repos/headertopRepo";
import Script from "next/script";
import WhatsAppButton from "./Components/WhatsAppButton";
// Define custom fonts using next/font/local
const Outfit = localFont({
  src: "./fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-Outfit",
  weight: "100-900",
});

const Cinzel = localFont({
  src: "./fonts/Cinzel-VariableFont_wght.ttf",
  variable: "--font-Cinzel",
  weight: "100-900",
});

const Racing = localFont({
  src: "./fonts/RacingSansOne-Regular.ttf",
  variable: "--font-Racing",
  weight: "100-900",
});

// Define props type for RootLayout
interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children }) => {
  const session = await getServerSession();

  const footerdata = await getHomeFooter();

  const settingsData = await getSettings();

  const headerTop = await getHeaderTop();

  return (
    <html lang="en">
      <head>
        <title>Dubblin</title>
        <meta name="description" content="Dubblin.com" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${Outfit.variable} ${Racing.variable} ${Cinzel.variable} antialiased`}
      >
        <StoreProvider>
          <Providers session={session}>
            <Script
              src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY}`}
              strategy="beforeInteractive"
            />
            <Header
              data={settingsData}
              userInfo={session?.user}
              headerTop={headerTop?.data?.HeaderTop[0]}
            />
            {children}
            <Footer footerdata={footerdata} />
            <WhatsAppButton /> {/* ✅ Add floating icon here */}
            <Toaster richColors position="bottom-center" />
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
export const dynamic = "force-dynamic";

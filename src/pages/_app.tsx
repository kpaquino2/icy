import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../styles/globals.css";
import { useSettingsStore } from "../utils/stores/settingsStore";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const dark = useSettingsStore((state) => state.appearance.dark);

  useEffect(() => {
    const className = dark ? "dark" : "light";
    document.documentElement.classList.add(className);
    return () => {
      document.documentElement.classList.remove(className);
    };
  }, [dark]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(
  dynamic(() => Promise.resolve(MyApp), { ssr: false })
);

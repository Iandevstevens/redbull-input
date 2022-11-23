import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useMemo, useState } from "react";
import Link from "next/link";

export const UserStateContext: any = createContext({
  user: {
    name: "test",
    type: "admin",
  },
  setUserSb: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  if (pageProps.protected && !user) {
    return (
      <>
        <div>Sorry, you dont have access</div>
        <Link href="/">Go to login</Link>
      </>
    );
  }
  return (
    <UserStateContext.Provider value={value}>
      <Component {...pageProps} />
    </UserStateContext.Provider>
  );
}

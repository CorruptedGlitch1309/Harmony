"use client";

import { useRef } from "react";
import { makeStore } from "./lib/store";
import { Provider } from "react-redux";

type AppStore = ReturnType<typeof makeStore>;

export default function StoreProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

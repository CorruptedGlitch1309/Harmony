"use client";

import { useRef } from "react";
import { makeStore } from "./lib/store";
import { Provider } from "react-redux";

export default function StoreProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

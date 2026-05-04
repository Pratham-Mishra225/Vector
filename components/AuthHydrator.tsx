"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

type AuthHydratorProps = {
  children: React.ReactNode;
};

export default function AuthHydrator({ children }: AuthHydratorProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

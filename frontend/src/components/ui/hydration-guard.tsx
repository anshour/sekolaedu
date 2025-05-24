import useUser from "@/context/use-user";
import { ReactNode } from "react";

interface HydrationGuardProps {
  children: ReactNode;
}

export default function ZustandHydrationGuard({
  children,
}: HydrationGuardProps) {
  const isHydrated = useUser((state) => state.isHydrated);

  if (!isHydrated) {
    return <></>;
  }

  return <>{children}</>;
}

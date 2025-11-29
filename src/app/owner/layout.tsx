import { ReactNode } from "react";

// Auth is enforced by Clerk middleware and client OwnerGate handles allowlist
export default function OwnerSectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

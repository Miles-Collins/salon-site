"use client";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function parseAllowlist(): Set<string> | null {
  const list = process.env.NEXT_PUBLIC_OWNER_ALLOWED_EMAILS || process.env.NEXT_PUBLIC_OWNER_ALLOWED_EMAIL || "";
  const emails = list
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.length ? new Set(emails) : null;
}

export default function OwnerGate({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const allow = parseAllowlist();

  useEffect(() => {
    if (user && allow) {
      const emails = (user.emailAddresses || []).map((e) => e.emailAddress.toLowerCase());
      const ok = emails.some((e) => allow.has(e));
      if (!ok) {
        router.replace("/");
      }
    }
  }, [user, allow, router]);

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/owner/dashboard" />
      </SignedOut>
    </>
  );
}

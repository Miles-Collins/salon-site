"use client";
import { SignedIn, SignedOut, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
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
        router.replace("/?error=unauthorized");
      }
    }
  }, [user, allow, router]);

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="w-full border-b bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm">Owner access requires sign in.</p>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal" forceRedirectUrl="/owner/dashboard">
                <button className="rounded bg-black text-white px-3 py-2 text-sm hover:opacity-90 dark:bg-white dark:text-black">Staff Portal</button>
              </SignInButton>
              {/* Fallback link in case Clerk modal cannot render */}
              <Link href="/sign-in" className="text-sm underline text-white/90 dark:text-white">Use sign-in page</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-muted-foreground text-sm">Please log in to manage site content.</p>
        </div>
      </SignedOut>
    </>
  );
}

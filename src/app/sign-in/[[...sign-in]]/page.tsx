"use client";
import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const raw = process.env.NEXT_PUBLIC_OWNER_ALLOWED_EMAILS || "";
    const emails = raw
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    setAllowedEmails(emails);
  }, []);

  async function start(email: string) {
    if (!isLoaded) return;
    setError("");
    setPending(true);
    try {
      setSelectedEmail(email);
      // Initiate email code (passwordless) sign-in flow
      const createRes = await signIn!.create({ identifier: email });
      if (createRes.firstFactorVerification?.strategy === "email_code") {
        setCodeSent(true);
      } else {
        setError("Email code strategy not enabled in Clerk settings.");
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message || "Failed to start sign-in.");
      setSelectedEmail("");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode() {
    if (!isLoaded) return;
    setError("");
    setPending(true);
    try {
      const attempt = await signIn!.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (attempt.status === "complete") {
        await setActive!({ session: attempt.createdSessionId });
        router.replace("/owner/dashboard");
      } else {
        setError("Invalid code. Try again.");
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message || "Failed to verify code.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Owner Sign In</h1>
        {!selectedEmail && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Select your account to receive a one-time access code.
            </p>
            <div className="flex flex-col gap-3">
              {allowedEmails.map((email) => (
                <button
                  key={email}
                  onClick={() => start(email)}
                  disabled={pending}
                  className="rounded border px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {email}
                </button>
              ))}
              {allowedEmails.length === 0 && (
                <div className="text-red-600 text-sm text-center">
                  No allowed emails configured.
                </div>
              )}
            </div>
          </div>
        )}
        {selectedEmail && !codeSent && (
          <div className="text-center text-sm">Sending code to {selectedEmail}...</div>
        )}
        {selectedEmail && codeSent && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Enter code sent to {selectedEmail}
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-transparent"
              placeholder="6-digit code"
              disabled={pending}
            />
            <div className="flex gap-2">
              <button
                onClick={verifyCode}
                disabled={pending || code.length === 0}
                className="flex-1 rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
              >
                Verify & Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedEmail("");
                  setCodeSent(false);
                  setCode("");
                  setError("");
                }}
                className="rounded border px-4 py-2"
                disabled={pending}
              >
                Back
              </button>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <p className="text-xs text-center text-muted-foreground">
          Access restricted to owner accounts only.
        </p>
      </div>
    </div>
  );
}

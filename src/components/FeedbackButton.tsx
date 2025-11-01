"use client";

import { usePathname } from "next/navigation";

type Props = {
  variant?: "mailto" | "form";
  className?: string;
  label?: string;
};

export default function FeedbackButton({ variant = "mailto", className = "", label = "Feedback" }: Props) {
  const pathname = usePathname();
  const email = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL || "hello@example.com";
  const formBase = process.env.NEXT_PUBLIC_FEEDBACK_FORM || "";

  // Include current page in the subject/body or form prefill
  const subject = encodeURIComponent(`Site feedback — ${pathname}`);
  const body = encodeURIComponent(`Page: ${pathname}\n\nYour feedback:\n`);
  const mailtoHref = `mailto:${email}?subject=${subject}&body=${body}`;

  // If using Google Form, append the page path to your short-answer entry
  // e.g., NEXT_PUBLIC_FEEDBACK_FORM=".../viewform?usp=pp_url&entry.123456="
  const formHref = formBase ? `${formBase}${encodeURIComponent(pathname)}` : "#";

  const href = variant === "mailto" ? mailtoHref : formHref;

  return (
    <a
      href={href}
      target={variant === "form" ? "_blank" : undefined}
      rel={variant === "form" ? "noreferrer" : undefined}
      className={`btn-outline ${className}`}
    >
      {label}
    </a>
  );
}

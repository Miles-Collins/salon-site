import FeedbackButton from "@/components/FeedbackButton";

export default function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="container flex items-center justify-between py-10 text-sm text-black/60">
        <p>© {new Date().getFullYear()} Hair by Porscha</p>
        <div className="flex gap-2">
          <FeedbackButton variant="mailto" />
          <FeedbackButton variant="form" label="Feedback (Form)" />
        </div>
      </div>
    </footer>
  );
}

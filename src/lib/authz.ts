export function getAllowedEmails(): Set<string> | null {
  const list = process.env.OWNER_ALLOWED_EMAILS || process.env.OWNER_ALLOWED_EMAIL || '';
  const emails = list
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.length ? new Set(emails) : null;
}

export function isEmailAllowed(userEmails: string[], allowlist: Set<string> | null): boolean {
  if (!allowlist) return true; // if not configured, allow
  for (const e of userEmails) {
    if (allowlist.has(e.toLowerCase())) return true;
  }
  return false;
}

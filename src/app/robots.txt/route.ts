import { NextResponse } from "next/server";

export function GET() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://colorrebelbyporscha.com/sitemap.xml",
  ].join("\n");
  return new NextResponse(lines, {
    headers: { "Content-Type": "text/plain" },
  });
}

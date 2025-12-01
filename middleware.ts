import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Lazily import Clerk only when keys are present to avoid build-time issues on Vercel
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
let handler: ((req: NextRequest) => Promise<Response> | Response) | null = null;

export default async function middleware(req: NextRequest) {
  if (!hasClerk) {
    return NextResponse.next();
  }
  if (!handler) {
    const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server');
    const isProtectedRoute = createRouteMatcher(['/owner(.*)']);
    handler = clerkMiddleware(async (auth: any, request: NextRequest) => {
      if (isProtectedRoute(request)) {
        await auth().protect();
      }
    });
  }
  return (handler as any)(req);
}

export const config = {
  // Skip Next internals & static files; always run for API
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};

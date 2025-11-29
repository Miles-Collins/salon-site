import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect owner routes and ensure Clerk attaches auth context
const isProtectedRoute = createRouteMatcher(['/owner(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  // Clerk recommended matcher (skip Next internals & static files; always run for API)
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};

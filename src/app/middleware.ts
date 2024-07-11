import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/", // Home page
  ]);

  export default clerkMiddleware((auth, request, event) => {
    if (!isPublicRoute(request)) {
      auth().protect(); // Protect all routes that are not explicitly public
    }
  });

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/onboarding",
  "admin",
  "moderator",
  "member",
]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAuth = createRouteMatcher(["sign-in"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isModeratorRoute = createRouteMatcher(["/moderator(.*)"]);
const isMemberRoute = createRouteMatcher(["/member(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (!userId && isProtectedRoutes(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete onboarding
  if (userId) {
    if ((await auth()).sessionClaims?.metadata?.role !== "member") {
      return NextResponse.next();
    }

    if (
      !req.url.startsWith("/onboarding") &&
      !sessionClaims?.metadata?.onboardingComplete
    ) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  if (
    isMemberRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "member"
  ) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  } else if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  } else if (
    isModeratorRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "moderator"
  ) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

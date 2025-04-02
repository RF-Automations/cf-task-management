/// <reference types="@clerk/express/env" />

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: "admin" | "mentor" | "member" | "ta" | "moderator";
      approved?: boolean;
      dbUserId?: string;
    };
  }
}

export {};

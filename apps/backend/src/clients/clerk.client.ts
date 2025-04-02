import { ClerkClient, createClerkClient } from "@clerk/backend";

const getClerkClient = (): ClerkClient => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!secretKey && !publishableKey) {
    throw new Error("Clerk credentials are invalid");
  }

  const customClerkClient = createClerkClient({
    secretKey,
    publishableKey,
  });
  return customClerkClient;
};

export default getClerkClient;

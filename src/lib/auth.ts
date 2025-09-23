// Using path import because with next-auth v4 + TS moduleResolution "bundler",
// the root "next-auth" export may not expose getServerSession's type symbols.
// "next-auth/next" reliably re-exports it for Next.js (App Router) environments.
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Provide a minimal structural type to satisfy getServerSession without using 'any'
// This avoids pulling full NextAuth types (which caused resolution issues) while keeping type safety local.
type MinimalAuthOptions = Record<string, unknown>;
export const getSession = () => getServerSession(authOptions as unknown as MinimalAuthOptions);

export const requireSession = async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
};
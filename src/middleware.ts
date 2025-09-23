import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login"
  }
});

// Match protected paths:
export const config = {
  // Protect the root page (src/app/page.tsx). Add more paths as needed.
  matcher: ["/"]
};
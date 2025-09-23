// NextAuth credentials-based route handler (App Router)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";


const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@example.com';
const DEMO_PASSWORD_HASH = process.env.DEMO_USER_PASSWORD_HASH || bcrypt.hashSync('password123', 10);

const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: DEMO_EMAIL,
  passwordHash: DEMO_PASSWORD_HASH,
};

// Local lightweight typing (avoids dependency on NextAuthOptions if resolution fails under bundler moduleResolution)
interface LocalAuthOptions {
  session: { strategy: 'jwt' | 'database' };
  pages?: { signIn?: string };
  providers: unknown[];
  callbacks: {
    jwt(args: { token: JWT & { userId?: string }; user?: { id: string } }): Promise<JWT & { userId?: string }>;
    session(args: { session: Session; token: JWT & { userId?: string } }): Promise<Session>;
  };
}

export const authOptions: LocalAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: DEMO_EMAIL },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        if (credentials.email.toLowerCase() !== DEMO_USER.email.toLowerCase()) return null;
        const ok = await bcrypt.compare(credentials.password, DEMO_USER.passwordHash);
        if (!ok) return null;
        return { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as JWT & { userId?: string };
      if (user) t.userId = user.id;
      return t;
    },
    async session({ session, token }) {
      const t = token as JWT & { userId?: string };
      if (t.userId && session.user) {
        (session.user as { id?: string }).id = t.userId;
      }
      return session;
    },
  },
};

// Cast NextAuth to a factory that accepts our local options shape (runtime is fine)
type NextAuthFactory = (options: LocalAuthOptions) => { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> };
const createAuth = NextAuth as unknown as NextAuthFactory;
const handler = createAuth(authOptions);
export { handler as GET, handler as POST };

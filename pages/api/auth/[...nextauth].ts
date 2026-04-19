import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ── Real DB users ────────────────────────────────────────────────────
        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (dbUser) {
          const valid = await bcrypt.compare(credentials.password, dbUser.password);
          if (valid) {
            return { id: dbUser.id, name: dbUser.name ?? dbUser.email, email: dbUser.email };
          }
          return null;
        }

        // ── Demo / admin fallback ────────────────────────────────────────────
        const demoAccounts = [
          { id: "admin-1", email: "admin@leadgen.app", password: "admin", name: "Admin" },
          { id: "admin-2", email: "admin", password: "admin", name: "Admin" },
          { id: "demo-1", email: "demo@leadgen.local", password: "password", name: "Demo User" },
        ];
        const demo = demoAccounts.find(
          (u) =>
            credentials.email.toLowerCase() === u.email.toLowerCase() &&
            credentials.password === u.password
        );
        if (demo) {
          return { id: demo.id, name: demo.name, email: demo.email };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET || "leadgen-dev-secret-change-in-production",
};

export default NextAuth(authOptions);
export { authOptions };

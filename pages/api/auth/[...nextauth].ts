import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Accept demo admin credentials
        const demoAdmins = [
          { id: 'admin-1', email: 'admin@dreamcatcher.app', password: 'admin', name: 'Admin User' },
          { id: 'admin-2', email: 'admin', password: 'admin', name: 'Admin User' },
        ];
        const match = demoAdmins.find(
          (u) =>
            credentials?.email?.toLowerCase() === u.email.toLowerCase() &&
            credentials?.password === u.password
        );
        if (match) {
          return { id: match.id, name: match.name, email: match.email };
        }
        // Also allow the old demo user for compatibility
        if (
          credentials?.email === "demo@leadgen.local" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Demo User", email: "demo@leadgen.local" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/logout"
  }
});

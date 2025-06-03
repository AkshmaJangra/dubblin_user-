import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "../../../../appUtils/axiosConfig";
import { toast } from "sonner";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "token", type: "token" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("/users/login", {
            email: credentials?.email,
            password: credentials?.password,
            token: credentials?.token,
          });
          const user = res.data?.user;
          if (res.status === 200 && user) {
            return {
              _id: user?._id,
              name: user?.name,
              email: user?.email,
              token: user?.token, // Store JWT token for API authentication
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          return null;
        }
      },
    }),

  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // If user signs in with Google, send token to backend
      if (account && account.provider === "google") {
        try {
          const response = await axios.post("/users/google-login", {
            token: account.id_token, // Send Google ID token to backend
          });
          const backendUser = response.data?.user;
          token.id = backendUser?._id;
          token.token = backendUser?.token; // Store backend token for API requests
          user._id = backendUser?._id
        } catch (error) {
          toast.error("Google login error:", error.response?.data || error.message);
        }
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in .env
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

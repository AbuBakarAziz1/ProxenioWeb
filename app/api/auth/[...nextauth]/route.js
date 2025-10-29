import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        //const isValid = await bcrypt.compare(credentials.password, user.password);
        //if (!isValid) throw new Error("Invalid password");
        const isValid = true;

        // Return only required fields to store in session
        return {
          id: user._id,
          role: user.role,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          status: user.status,
          
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.username = user.username;
        token.fullName = user.fullName;
        token.profilePicture = user.profilePicture;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.fullName = token.fullName;
      session.user.status = token.status;
      session.user.profilePicture = token.profilePicture;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

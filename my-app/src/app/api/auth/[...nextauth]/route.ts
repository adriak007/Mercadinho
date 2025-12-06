import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { conectaDB } from "@/app/api/connect/mongoose";
import Users from "@/app/api/models/users";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await conectaDB();

        const user = await Users.findOne({ email: credentials.email });

        if (!user) return null;

        const senhaOk = await compare(credentials.password, user.password);
        if (!senhaOk) return null;

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        const { username, email, password, isSignUp } = credentials;

        const res = await fetch("http://localhost:3000/api/users", {
          method: 'POST',
          body: JSON.stringify({ username, email, password, isSignUp }),
          headers: { "Content-Type": "application/json" }
        });

        const user = await res.json()
        return user;
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.type = token.type;
      return session;
    }
  }
}

export default NextAuth(authOptions)
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    strict: true,
    deprecationErrors: true,
  }
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, email, password, isSignUp } = req.body;
        try {
          await client.connect();
          const db = client.db('TechnoBlog');
          const userCollection = db.collection('User');
          const user = await userCollection.findOne({ email });
          return user;
        }
        catch (err) {
          console.log(err);
        }
        // const res = await fetch("/your/endpoint", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const user = await res.json()

      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  }
}

export default NextAuth(authOptions)
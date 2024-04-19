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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const credentials = req.body;
        const { email, password, username, isSignUp } = credentials;
        try {
            await client.connect();
            const db = client.db('TechnoBlog');
            const userCollection = db.collection('User');
            const user = await userCollection.findOne({ email, password });
            if (isSignUp == 'true') {
                const existingUser = await userCollection.findOne({ email });
                if (existingUser) {
                    return res.status(409).json({ message: 'User already exists' });
                }

                const isValidEmail = (email) => {
                    const regex = /^(2[0-9]{3}|[3-9][0-9]{3})\d*@daiict\.ac\.in$/;
                    return regex.test(email);
                };

                if (!isValidEmail(email)) {
                    return res.status(410).json({ message: 'Not DAIICT email.' });
                }

                const newUser = await userCollection.insertOne({ email, password, name: username, type: "author" });
                const registeredUser = await userCollection.findOne({ _id: newUser.insertedId });
                return res.status(201).json(registeredUser);
            } else {
                const user = await userCollection.findOne({ email, password });
                if (!user) {
                    return res.status(404).json({ message: 'User not found or password does not match' });
                }
                res.status(200).json(user);
            }
            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to connect to database' });
        } finally {
            await client.close();
        }
    } else {
        res.status(400).json({ message: 'Only POST method is allowed' });
    }
}
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
    if (req.method === 'GET') {
        try {
            await client.connect();
            const db = client.db('TechnoBlog');
            const collection = db.collection('Article');
            const articles = await collection.find({}).toArray();
            res.status(200).json(articles);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to connect to database' });
        } finally {
            await client.close();
        }
    } else {
        res.status(400).json({ message: 'Only GET method is allowed' });
    }
}
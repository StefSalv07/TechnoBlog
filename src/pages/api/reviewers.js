import { MongoClient } from 'mongodb';
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
});

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET method is allowed' });
    }

    try {
        await client.connect();
        const db = client.db('TechnoBlog');
        const userCollection = db.collection('User');
        const reviewers = await userCollection.find({ type: 'reviewer' }).toArray();

        res.status(200).json(reviewers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to connect to database' });
    } finally {
        await client.close();
    }
}

export default handler;

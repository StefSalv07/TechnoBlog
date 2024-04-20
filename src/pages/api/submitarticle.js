import { MongoClient, ObjectId, MongoId } from 'mongodb';
import { signOut } from 'next-auth/react';

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }


    try {
        await client.connect();
        const db = client.db('TechnoBlog');
        const articleCollection = db.collection('Article');
        const userCollection = db.collection('User');
        const categoryCollection = db.collection('BlogCategory');

        const { title, content, summary, authorName, categories, reviewer } = req.body;

        const author = await userCollection.findOne({ name: authorName });
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        const reviewerID = (await userCollection.findOne({ name: reviewer }))._id;

        const categoryIds = [];
        for (const categoryName of categories) {
            let category = await categoryCollection.findOne({ name: categoryName });
            if (!category) {
                const result = await categoryCollection.insertOne({ name: categoryName });
                category = { _id: result.insertedId };
            }
            categoryIds.push(category._id);
        }

        const newArticle = {
            title,
            summary,
            content,
            authorId: author._id,
            categories: categoryIds.map(catId => new ObjectId(catId)),
            published: false,
            reviewersId: [
                reviewerID
            ],
            reviewsId: []
        };

        const result = await articleCollection.insertOne(newArticle);
        res.status(201).json({ message: 'Article submitted successfully', articleId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit article' });
    } finally {
        await client.close();
    }
}

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET method is allowed' });
        return;
    }

    const { blogId } = req.query;

    if (blogId) {
        try {
            await client.connect();
            const db = client.db('TechnoBlog');
            const articleCollection = db.collection('Article');
            const article = await articleCollection.find({ _id: new ObjectId(blogId)}).toArray();
            res.status(200).json(article);
        }
        catch (err) {
            console.log(err);
        }
        return;
    }

    try {
        await client.connect();
        const db = client.db('TechnoBlog');
        const articleCollection = db.collection('Article');
        const userCollection = db.collection('User');
        const BlogCategoryCollection = db.collection('BlogCategory');
        const reviewCollection = db.collection('Review');

        const articlesWithDetails = await db.collection('Article').aggregate([
            {
                $lookup: {
                    from: "User",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            {
                $lookup: {
                    from: "BlogCategory",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "reviewersId",
                    foreignField: "_id",
                    as: "reviewerDetails"
                }
            },
            {
                $lookup: {
                    from: "Review",
                    localField: "_id",
                    foreignField: "articleID",
                    as: "reviewDetails"
                }
            },
            {
                $unwind: {
                    path: "$authorDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$reviewerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$reviewDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    summary: { $first: "$summary" },
                    published: { $first: "$published" },
                    content: { $first: "$content" },
                    authorName: { $first: "$authorDetails.name" },
                    authorEmail: { $first: "$authorDetails.email" },
                    categories: { $first: "$categoryDetails.category" },
                    reviewerNames: { $addToSet: "$reviewerDetails.name" },
                    reviewerEmails: { $addToSet: "$reviewerDetails.email" },
                    reviews: { $addToSet: "$reviewDetails.review" }  // Use $addToSet to avoid duplication
                }
            },
            {
                $project: {
                    title: 1,
                    summary: 1,
                    published: 1,
                    content: 1,
                    authorName: 1,
                    authorEmail: 1,
                    categories: 1,
                    reviewerNames: 1,
                    reviewerEmails: 1,
                    reviews: 1
                }
            }
        ]).toArray();
        // const articles = await articleCollection.find({}).toArray();
        res.status(200).json(articlesWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to connect to database' });
    } finally {
        await client.close();
    }
}

async function clearCollection(collection) {
    const result = await collection.deleteMany({});
    console.log(`Documents deleted: ${result.deletedCount}`);
}
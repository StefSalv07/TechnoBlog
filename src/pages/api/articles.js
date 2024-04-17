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
            const articleCollection = db.collection('Article');
            const userCollection = db.collection('User');
            const BlogCategoryCollection = db.collection('BlogCategory');
            const reviewCollection = db.collection('Review');

            //     const loremId = (await BlogCategoryCollection.findOne({category: "lorem ipsum"}))._id;
            //     const testDataId = (await BlogCategoryCollection.findOne({category: "test data"}))._id;

            //     const user = await userCollection.findOne({name: "author1"});
            //     const userId = user._id;
            //     const reviewer1Id = (await userCollection.findOne({name: "reviewer1"}))._id;
            //     const reviewer2Id = (await userCollection.findOne({name: "reviewer2"}))._id;

            //      await clearCollection(articleCollection);
            //     const document = {
            //     title: "Lorem Ipsum",
            //     summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            //     authorId: userId,
            //     categories: [loremId, testDataId],
            //     published: true,
            //     reviewersId: [reviewer1Id, reviewer2Id],
            //     reviews: [null],
            //     content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
            // };

            // // Insert the article document
            // await articleCollection.insertOne(document);
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
    } else {
        res.status(400).json({ message: 'Only GET method is allowed' });
    }
}

async function clearCollection(collection) {
    const result = await collection.deleteMany({});
    console.log(`Documents deleted: ${result.deletedCount}`);
}
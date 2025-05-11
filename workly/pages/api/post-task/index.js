import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, title, description, category, budget, location } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const client = await MongoClient.connect(
            process.env.MONGODB_URI
        );
        const db = client.db();

        const tasksCollection = db.collection("tasks");
        const result = await tasksCollection.insertOne({
            title: title,
            description: description,
            category: category,
            budget: budget,
            location: location,
            status: "open",
            userId: userId,
            createdAt: new Date(),
        });

        await client.close();

        res.status(201).json({
            message: 'Task Posted successful!',
            result
        });

    } catch (error) {
        console.error('Error in Posting Task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
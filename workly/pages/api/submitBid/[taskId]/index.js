import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { taskId } = req.query;
        const { userId, userName, amount, message, deliveryTime, phoneNumber } = req.body;
        // Validate required fields
        if (!taskId || !userId || !amount || !message || !phoneNumber) {
            return res.status(400).json({
                message: 'Missing required fields: taskId, userId, amount, and message are required'
            });
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const tasksCollection = db.collection("tasks");
        const task = await tasksCollection.findOne({
            _id: new ObjectId(taskId)
        });

        if (!task) {
            await client.close();
            return res.status(404).json({ message: 'Task not found' });
        }

        const newBid = {
            userId: new ObjectId(userId),
            taskId: new ObjectId(taskId),
            userName,
            amount: Number(amount),
            message,
            deliveryTime: deliveryTime || 'Not specified',
            phoneNumber,
            status: 'pending',
            createdAt: new Date()
        };

        const bidsCollection = db.collection("bids");
        const result = await bidsCollection.insertOne({
            ...newBid
        });

        await client.close();

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to Add bid' });
        }

        res.status(201).json({
            message: 'Bid submitted successfully!',
            bid: { newBid }
        });

    } catch (error) {
        console.error('Error submitting bid:', error);

        if (error.message.includes('hex string')) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
}
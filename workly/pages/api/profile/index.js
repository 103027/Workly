import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const users = await db.collection('users').find({}).toArray();

        if (!users) {
            await client.close();
            return res.status(404).json({ message: 'Users not found' });
        }

        await client.close();

        const userIds = users.map(user => user._id.toString());

        res.status(200).json({userIds});

    } catch (error) {
        console.error('User fetching error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
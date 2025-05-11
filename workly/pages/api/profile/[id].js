import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            await client.close();
            return res.status(404).json({ message: 'User not found' });
        }

        const tasksCollection = db.collection('tasks');

        const completedTasks = await tasksCollection.find(
            {
                status: 'completed',
                $or: [
                    { userId: id },
                    { assignedTo: new ObjectId(id) }
                ]
            }
        ).toArray();

        await client.close();

        const response = {
            ...user, completedTasks: completedTasks.length
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
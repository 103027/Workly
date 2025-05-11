import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;
        const { role } = req.body;

        // Validate role
        if (!['employer', 'employee'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const client = await MongoClient.connect(
            process.env.MONGODB_URI
        );
        const db = client.db();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Role updated successfully',
            userId,
            newRole: role
        });

    } catch (error) {
        console.error('Role update error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
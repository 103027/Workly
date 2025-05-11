import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { taskId, bidId } = req.query;
        const { userId } = req.body;

        if (!taskId || !bidId || !userId) {
            return res.status(400).json({ 
                message: 'Missing required parameters: taskId, bidId, and userId are required' 
            });
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const tasksCollection = db.collection("tasks");
        const bidsCollection = db.collection("bids");

        // Verify task exists and belongs to the user
        const task = await tasksCollection.findOne({ 
            _id: new ObjectId(taskId),
            userId: userId
        });

        if (!task) {
            await client.close();
            return res.status(404).json({ 
                message: 'Task not found or you are not the task owner' 
            });
        }

        const bid = await bidsCollection.findOne({ 
            _id: new ObjectId(bidId),
            taskId: new ObjectId(taskId)
        });

        if (!bid) {
            await client.close();
            return res.status(404).json({ message: 'Bid not found for this task' });
        }

        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                await bidsCollection.updateOne(
                    { _id: new ObjectId(bidId) },
                    { $set: { status: 'accepted' } },
                    { session }
                );

                await tasksCollection.updateOne(
                    { _id: new ObjectId(taskId) },
                    { 
                        $set: { 
                            status: 'in-progress',
                            assignedTo: new ObjectId(bid.userId),
                            assignedAt: new Date()
                        } 
                    },
                    { session }
                );

                await bidsCollection.updateMany(
                    { 
                        taskId: new ObjectId(taskId),
                        _id: { $ne: new ObjectId(bidId) }
                    },
                    { $set: { status: 'rejected' } },
                    { session }
                );
            });
        } finally {
            await session.endSession();
        }

        await client.close();

        res.status(200).json({
            message: 'Bid accepted successfully!',
            taskId,
            bidId
        });

    } catch (error) {
        console.error('Error accepting bid:', error);
        
        if (error.message.includes('hex string')) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
}
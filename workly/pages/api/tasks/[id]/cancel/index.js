import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({
            success: false,
            error: 'MethodNotAllowed',
            message: 'Only PATCH requests are accepted'
        });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const session = client.startSession();

    try {
        const { id } = req.query;
        const { userId } = req.body;

        if (!id || !userId) {
            return res.status(400).json({
                success: false,
                error: 'MissingParameters',
                message: 'taskId and userId are required'
            });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'InvalidIdFormat',
                message: 'Invalid task ID format'
            });
        }

        await session.withTransaction(async () => {
            const db = client.db();
            const tasksCollection = db.collection('tasks');
            const bidsCollection = db.collection('bids');

            const task = await tasksCollection.findOne(
                { _id: new ObjectId(id) },
                { session }
            );

            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'TaskNotFound',
                    message: 'Task does not exist'
                });
            }

            if (task.userId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Only task owner can cancel'
                });
            }

            if (task.status === 'completed') {
                return res.status(409).json({
                    success: false,
                    error: 'InvalidStatus',
                    message: 'Completed tasks cannot be canceled'
                });
            }

            const updateOperations = [
                tasksCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            status: 'canceled',
                            canceledAt: new Date()
                        }
                    },
                    { session }
                ),
                bidsCollection.updateMany(
                    {
                        taskId: new ObjectId(id),
                        status: { $ne: 'rejected' }
                    },
                    {
                        $set: {
                            status: 'rejected',
                            rejectedAt: new Date(),
                            rejectionReason: 'Task canceled by owner'
                        }
                    },
                    { session }
                )
            ];

            const result = await Promise.all(updateOperations);

            return res.status(200).json({
                success: true,
                message: 'Task canceled and bids rejected',
                data: {
                    id,
                }
            });
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction error:', error);

        return res.status(500).json({
            success: false,
            error: 'TransactionFailed',
            message: error.message || 'Failed to cancel task'
        });
    } finally {
        await session.endSession();
        await client.close();
    }
}
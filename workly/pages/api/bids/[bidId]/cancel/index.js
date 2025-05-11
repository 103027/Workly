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
        const { bidId } = req.query;
        const { userId } = req.body;

        // Input validation
        if (!bidId || !userId) {
            return res.status(400).json({
                success: false,
                error: 'MissingParameters',
                message: 'bidId and userId are required'
            });
        }

        if (!ObjectId.isValid(bidId)) {
            return res.status(400).json({
                success: false,
                error: 'InvalidIdFormat',
                message: 'Invalid bid ID format'
            });
        }

        await session.withTransaction(async () => {
            const db = client.db();
            const bidsCollection = db.collection('bids');
            const tasksCollection = db.collection('tasks');

            // 1. Verify bid exists and belongs to user
            const bid = await bidsCollection.findOne(
                { _id: new ObjectId(bidId) },
                { session }
            );

            if (!bid) {
                return res.status(404).json({
                    success: false,
                    error: 'BidNotFound',
                    message: 'Bid does not exist'
                });
            }

            if (bid.userId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Only bid creator can cancel this bid'
                });
            }

            // 2. Get associated task
            const task = await tasksCollection.findOne(
                { _id: new ObjectId(bid.taskId) },
                { session }
            );

            // 3. Check if bid was accepted
            const wasAccepted = bid.status === 'accepted';

            // 4. Update the bid status
            await bidsCollection.updateOne(
                { _id: new ObjectId(bidId) },
                {
                    $set: {
                        status: 'canceled',
                        canceledAt: new Date(),
                        cancellationReason: 'Canceled by bidder'
                    }
                },
                { session }
            );

            // 5. If this was the accepted bid, reset task and other bids
            if (wasAccepted) {
                await Promise.all([
                    tasksCollection.updateOne(
                        { _id: new ObjectId(bid.taskId) },
                        {
                            $set: {
                                status: 'open',
                                assignedTo: null,
                                assignedAt: null
                            },
                            $unset: {
                                employerConfirmed: "",
                                employeeConfirmed: ""
                            }
                        },
                        { session }
                    ),
                    bidsCollection.updateMany(
                        {
                            taskId: new ObjectId(bid.taskId),
                            _id: { $ne: new ObjectId(bidId) },
                            status: 'rejected'
                        },
                        {
                            $set: {
                                status: 'pending',
                                rejectedAt: null,
                                rejectionReason: null
                            }
                        },
                        { session }
                    )
                ]);
            }

            return res.status(200).json({
                success: true,
                message: wasAccepted
                    ? 'Bid canceled and task reopened'
                    : 'Bid canceled',
                data: {
                    bidId,
                    taskId: bid.taskId,
                    wasAccepted
                }
            });
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction error:', error);

        return res.status(500).json({
            success: false,
            error: 'TransactionFailed',
            message: error.message || 'Failed to cancel bid'
        });
    } finally {
        await session.endSession();
        await client.close();
    }
}
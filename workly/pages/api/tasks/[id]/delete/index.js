import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const session = client.startSession();

  try {
    const { id } = req.query;
    const { userId } = req.body;

    // Validate inputs
    if (!id || !userId) {
      return res.status(400).json({ message: 'task ID and user ID are required' });
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
        throw new Error('Task not found');
      }

      if (task.userId.toString() !== userId) {
        throw new Error('Unauthorized: Only task owner can delete');
      }

      if (['in-progress', 'completed'].includes(task.status)) {
        throw new Error(`Cannot delete ${task.status} tasks`);
      }

      await tasksCollection.deleteOne(
        { _id: new ObjectId(id) },
        { session }
      );

      await bidsCollection.deleteMany(
        { taskId: new ObjectId(id) },
        { session }
      );

      res.status(200).json({
        message: 'Task and all associated bids deleted successfully',
        deletedTaskId: id
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Deletion error:', error);
    res.status(error.message.includes('Unauthorized') ? 403 : 400)
       .json({ message: error.message });
  } finally {
    await session.endSession();
    await client.close();
  }
}
import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const tasksCollection = db.collection("tasks");
        const bidsCollection = db.collection("bids");

        // Get all tasks with status open
        const tasks = await tasksCollection.find({ status: 'open' }).toArray();

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found!' });
        }

        const tasksWithBids = await Promise.all(
            tasks.map(async (task) => {
                const bids = await bidsCollection.find({ taskId: new ObjectId(task._id) }).toArray();
                return {
                    ...task,
                    bids
                };
            })
        );

        res.status(200).json({
            message: 'Tasks with bids retrieved successfully!',
            data: { tasks: tasksWithBids }
        });

        client.close();

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default handler;
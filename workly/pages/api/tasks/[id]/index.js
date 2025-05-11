import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const tasksCollection = db.collection("tasks");

        const task = await tasksCollection.findOne({ 
            _id: new ObjectId(id) 
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found!' });
        }

        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ 
            _id: new ObjectId(task.userId) 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const { Password, ...safeUser } = user;

        const bidsCollection = db.collection("bids");
        const bids = await bidsCollection.find({ taskId: new ObjectId(task._id) }).toArray();

        res.status(200).json({
            message: 'Task retrieved successfully!',
            data: {...task, postedBy: safeUser , bids: bids}
        });

    } catch (error) {
        console.error('Database Error:', error);
        
        if (error.message.includes('hex string')) {
            return res.status(400).json({ message: 'Invalid task ID format' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default handler;
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
        const { userId } = req.query;
        const { userType } = req.body;
        
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        
        if (userType === 'employer') {
            const tasks = await db.collection('tasks').find({ userId }).toArray();
            
            if (tasks.length === 0) {
                await client.close();
                return res.status(200).json({
                    message: 'No tasks found',
                    counts: {
                        total: 0,
                        open: 0,
                        canceled: 0,
                        completed: 0,
                        inProgress: 0
                    },
                    tasks: [],
                    bids: []
                });
            }
            
            const counts = tasks.reduce((acc, task) => {
                acc.total++;
                switch (task.status) {
                    case 'open': acc.open++; break;
                    case 'canceled': acc.canceled++; break;
                    case 'completed': acc.completed++; break;
                    case 'in-progress': acc.inProgress++; break;
                    default: console.log('Unexpected status:', task.status); break;
                }
                return acc;
            }, {
                total: 0,
                open: 0,
                canceled: 0,
                completed: 0,
                inProgress: 0
            });
            
            await client.close();
            res.status(200).json({
                counts,
                tasks,
                bids: []
            });
        } 
        else if (userType === 'employee') {
            const bids = await db.collection('bids').find({ userId: new ObjectId(userId) }).toArray();
            
            const taskIds = bids.map(bid => new ObjectId(bid.taskId));
            
            const bidTasks = await db.collection('tasks').find({
                _id: { $in: taskIds }
            }).toArray();
            
            const openTasks = await db.collection('tasks').find({
                status: 'open',
                _id: { $nin: taskIds }
            }).toArray();
            
            const allTasks = [...bidTasks, ...openTasks];
            
            const openTasksCount = allTasks.filter(task => task.status === 'open').length;
            
            const bidTaskCounts = bidTasks.reduce((acc, task) => {
                if (task.status === 'canceled') acc.canceled++;
                else if (task.status === 'completed') acc.completed++;
                else if (task.status === 'in-progress') acc.inProgress++;
                return acc;
            }, {
                canceled: 0,
                completed: 0,
                inProgress: 0
            });
            
            const counts = {
                total: allTasks.length,
                open: openTasksCount,
                canceled: bidTaskCounts.canceled,
                completed: bidTaskCounts.completed,
                inProgress: bidTaskCounts.inProgress
            };
            
            await client.close();
            res.status(200).json({
                counts,
                tasks: bidTasks,
                bids
            });
        }
        else {
            await client.close();
            return res.status(400).json({ message: 'Invalid user type' });
        }
    } catch (error) {
        console.error('Task fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bidId } = req.query;
    const { userId } = req.body;

    if (!bidId || !userId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const bidsCollection = db.collection('bids');

    const bid = await bidsCollection.findOne({
      _id: new ObjectId(bidId),
      userId: new ObjectId(userId)
    });

    if (!bid) {
      await client.close();
      return res.status(404).json({ 
        message: 'Bid not found or not owned by user' 
      });
    }

    await bidsCollection.deleteOne({ _id: new ObjectId(bidId) });
    await client.close();

    res.status(200).json({ 
      message: 'Bid deleted successfully',
      deletedBidId: bidId
    });

  } catch (error) {
    console.error('Error deleting bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
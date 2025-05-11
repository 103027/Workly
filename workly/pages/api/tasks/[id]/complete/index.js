import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { id } = req.query;
    const { userId, userType, rating, review } = req.body;
    
    if (!id || !userId || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const tasksCollection = db.collection('tasks');
    const usersCollection = db.collection('users');
    
    const task = await tasksCollection.findOne({ 
      _id: new ObjectId(id),
      status: 'in-progress'
    });
    
    if (!task) {
      await client.close();
      return res.status(404).json({ message: 'Task not found or not eligible for completion' });
    }
    
    // Validate user authorization
    if (
      (userType === 'employer' && task.userId !== userId) ||
      (userType === 'employee' && task.assignedTo.toString() !== userId)
    ) {
      await client.close();
      return res.status(403).json({ message: 'Not authorized to confirm completion' });
    }
    
    // Determine which confirmation field to update
    const updateField = userType === 'employer' 
      ? 'employerConfirmed'
      : 'employeeConfirmed';
    
    // Update task confirmation status
    await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [updateField]: true } }
    );
    
    // Handle rating and review if provided
    if (rating && rating > 0) {
      let ratedUserId;
      let ratingField;
      let reviewField;
      
      if (userType === 'employer') {
        // Employer rating an employee
        ratedUserId = task.assignedTo;
        ratingField = 'employeeRating';
        reviewField = 'employeeReview';
      } else {
        // Employee rating an employer
        ratedUserId = task.userId;
        ratingField = 'employerRating';
        reviewField = 'employerReview';
      }
      
      // Add the new rating to the rated user's profile
      const ratingData = {
        taskId: new ObjectId(id),
        raterId: userId,
        raterType: userType,
        rating: Number(rating),
        review: review || '',
        createdAt: new Date()
      };
      
      // Update the user document - add rating and update average
      await usersCollection.updateOne(
        { _id: new ObjectId(ratedUserId) },
        { 
          $push: { ratings: ratingData },
          $inc: { totalRatingPoints: Number(rating), totalRatingsCount: 1 }
        }
      );
      
      // Calculate and update the average rating
      const ratedUser = await usersCollection.findOne({ _id: new ObjectId(ratedUserId) });
      const averageRating = ratedUser.totalRatingPoints / ratedUser.totalRatingsCount;
      
      await usersCollection.updateOne(
        { _id: new ObjectId(ratedUserId) },
        { $set: { averageRating: averageRating } }
      );
      
    }
    
    // Check if both parties confirmed
    const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
    if (updatedTask.employerConfirmed && updatedTask.employeeConfirmed) {
      await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'completed', completedAt: new Date() } }
      );
    }
    
    await client.close();
    res.status(200).json({ 
      message: 'Confirmation recorded',
      ratingSubmitted: rating && rating > 0 ? true : false 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
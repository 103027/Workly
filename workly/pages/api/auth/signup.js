import { MongoClient } from "mongodb";
import bcrypt from 'bcryptjs';

async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password, fullname, phoneNumber } = req.body;

        if (!email || !password || !fullname || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        if (phoneNumber.length < 11) {
            return res.status(400).json({ message: 'Wrong Phone Number' });
        }

        const client = await MongoClient.connect(
            process.env.MONGODB_URI
        );

        const db = client.db();
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ Email: email });
        if (existingUser) {
            await client.close();
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await usersCollection.insertOne({
            Fullname: fullname,
            Email: email,
            Password: hashedPassword,
            phoneNumber: phoneNumber,
            role:"",
            createdAt: new Date()
        });

        await client.close();

        res.status(201).json({
            message: 'Signup successful!',
            user: {
                id: result.insertedId,
                email,
                name: fullname,
                phoneNumber,
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default handler;
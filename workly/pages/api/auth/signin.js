// pages/api/auth/signin.js
import { MongoClient } from "mongodb";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const client = await MongoClient.connect(
            process.env.MONGODB_URI
        );

        const db = client.db();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ Email: email });

        if (!user) {
            await client.close();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            await client.close();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.Email,
            },
            "XDKoIIWUB8msjqPT",
            { expiresIn: '24h' }
        );

        await client.close();

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.Email,
                name: user.Fullname,
                role: user.role,
                phoneNumber: user.phoneNumber
            }
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default handler;
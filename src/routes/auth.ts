import express, { Request, Response, Router } from 'express';
import { readData, writeData } from '../helpers/fileHelpers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const USERS_FILE = './src/storage/users.json';

interface User {
  id: number;
  email: string;
  password: string;
  role: string; 
}

// Register route
router.post('/register', async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;
  
	// All new users will be assigned the "user" role, no admins can register
	const role = 'user'; // Hardcoded to "user", prevent admin role registration
  
	const users: User[] = readData<User[]>(USERS_FILE);
  
	// Check if email already exists
	if (users.find(user => user.email === email)) {
	  return res.status(400).json({ message: 'Email already exists' });
	}
  
	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);
  
	// Create new user object
	const newUser: User = { id: users.length + 1, email, password: hashedPassword, role };
  
	// Push the new user to the users array
	users.push(newUser);
  
	// Write the updated users data to the file
	writeData(USERS_FILE, users);
  
	// Respond with success message
	res.status(201).end();
  });
  

// Login route -----------------------
router.post('/login', async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;
  
	// Hardcoded admin credentials
	const adminEmail = 'aaa@gmail.com';
	const adminPassword = 'aaa123';
  
	// Check if email is admin and password matches
	if (email === adminEmail && password === adminPassword) {
	  const token = jwt.sign(
		{ email: adminEmail, role: 'admin' },
		JWT_SECRET,
		{ expiresIn: '1h' }
	  );
  
	  return res.json({ token, role: 'admin' });
	}
  
	const users: User[] = readData<User[]>(USERS_FILE);
  
	// Find the user with the provided email
	const user = users.find(u => u.email === email);
	if (!user) {
	  return res.status(401).json({ message: 'Invalid email or password' });
	}
  
	// Compare the provided password with the stored hashed password
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
	  return res.status(401).json({ message: 'Invalid email or password' });
	}
  
	// Generate JWT token for non-admin users
	const token = jwt.sign(
	  { id: user.id, email: user.email, role: user.role },
	  JWT_SECRET,
	  { expiresIn: '1h' }
	);
  
	res.json({ token, role: user.role });
  });
  
export default router;

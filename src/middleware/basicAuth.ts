import { Request, Response, NextFunction } from 'express';
// import { readData } from '../helpers/fileHelpers';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get the JWT secret from the environment variable
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: string;
    }
  }
}

// Middleware to authenticate JWT
const basicAuth = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);  // Verify token
    req.userId = decoded.id;
    req.role = decoded.role;  // Attach role to request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export default basicAuth;

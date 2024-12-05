import { Request, Response, NextFunction } from 'express';

export const checkAdminRole = (req: Request, res: Response, next: NextFunction): any => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next(); // Proceed to the next middleware or route handler
};

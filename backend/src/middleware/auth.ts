import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../model/user";


export interface IRequest extends Request {
  user ?: any
}

export const auth = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success:false, message: 'Please authenticate' });
  }
};

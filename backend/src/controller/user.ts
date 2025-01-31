import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from "../model/user";
import { UserCredentials } from '../types';
import { IRequest } from '../middleware/auth';

interface UserResponse {
  success: boolean,
  message: string,
  data?: Record<string,string|IUser>;
  user?: IUser;
}
interface ErrorResponse {
  success: boolean,
  message: string,
  detail?: any,
}

// res.status(201).json({ token, user });
const signup = async (req: Request<{}, {}, UserCredentials>, res: Response<UserResponse | ErrorResponse>) => {
  const { email, username, password } = req.body

  try {  
    //! zod validation
    const user = new User({ email, username, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    const data = { token : token, user : user }

    res.status(200).json({success: true, message: "User signed up", data})
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error",detail: error})
  }
};

const login = async (req: Request<{}, {}, UserCredentials>, res: Response<UserResponse | ErrorResponse>) => {
  const { email, password } = req.body
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({success: false, message: 'Login failed'})
      return
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    const data = { token : token, user : user }

    res.status(200).json({success: true, message: "User logged in",data})
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error",detail: error})
  }
}

const searchUser =  async (req: IRequest, res: Response) => {
  try {
    const searchQuery = req.query.q as string;
    const userId = req.user?._id;

    const currentUser = await User.findById(userId);
    const userFriends = currentUser?.friends || [];

    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: searchQuery, $options: 'i' },
          _id: { $ne: userId },
          friends: { $nin: [userId] }
        }
      },
      {
        $project: {
          username: 1,
          mutualFriends: {
            $size: {
              $setIntersection: ["$friends", userFriends]
            }
          }
        }
      },
      { $limit: 10 }
    ]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}


export {
  signup,
  login,
  searchUser
}
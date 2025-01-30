import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from "../model/user";
import { UserCredentials } from '../types';

interface UserResponse {
  success: boolean,
  message: string,
  data?: Record<string,string>;
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
    const data = { token : token }

    res.status(200).json({success: true, message: "User signed up", data})
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error",detail: error})
  }
};

const login = async (req: Request<{}, {}, UserCredentials>, res: Response<UserResponse | ErrorResponse>) => {
  const { email, password } = req.body
  //! zod validation
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({success: false, message: 'Login failed'})
      return
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    const data = { token : token }

    res.status(200).json({success: true, message: "User logged in",data})
  } catch (error) {
    res.status(500).json({success: false, message: "Internal Server Error",detail: error})
  }
};

export {
  signup,
  login
}








// import { Request, Response } from "express";
// import z from 'zod'
// // import pool from "../db";

// import jwt from 'jsonwebtoken'

// // import { SignupRequest, SigninRequest } from "../types/controller/user";

// const singupSchema = z.object({
//   username: z.string().min(3),
//   email: z.string().email().min(1),
//   password: z.string().min(8)
// })
// const signinSchema = z.object({
//   email: z.string().email().min(3),
//   password: z.string().min(8)
// })

// const signup = async (req: SignupRequest, res: Response) => {
//   const user = req.body

//   const client = await pool.connect()
//   const insertQuery = `
//     INSERT INTO users (username , email , password)
//     VALUES ( $1 , $2 , $3 )
//     RETURNING id ;
//   `
//   try {
//     const { success, data } = singupSchema.safeParse(user)
//     if (!success) {
//       return res.status(400).json({ message: "Invalid input value" })
//     }

//     const values = [data.username, data.email, data.password]
//     const insertResult = await client.query(insertQuery, values)

//     const token = jwt.sign({
//       id: insertResult.rows[0].id
//     }, process.env.JWT_SECRET!)

//     const options = {
//       maxAge: 1000 * 60 * 60 * 24,
//       domain: 'localhost',
//       path: '/',
//     }
//     res.cookie('auth_token', token, options)

//     res.status(200).json({
//       message: "ok"
//     })

//   } catch (error: any) {
//     error.code == 23505
//       ? res.status(400).json({ message: 'user already exists' })
//       : res.status(400).json({ message: error.message });
//   } finally {
//     client.release()
//   }
// }

// const signin = async (req: SigninRequest, res: Response) => {
//   // const user = req.body
//   // const userId = req.userId
//   const { email, password } = req.body
//   const client = await pool.connect()
//   const selectQuery = `
//     SELECT * FROM users
//     WHERE email = $1 AND password = $2;
//   `
//   try {
//     // const { success, data } = signinSchema.safeParse(user)
//     const { success, data } = signinSchema.safeParse({ email, password })
//     if (!success) {
//       return res.status(400).json({ message: 'Invalid input value' })
//     }

//     const result = await client.query(selectQuery, [email,password])
//     if (result.rows.length === 0) {
//       return res.status(403).json({ message: 'user not found' })
//     }

//     const token = jwt.sign({
//       id: result.rows[0].id
//     }, process.env.JWT_SECRET!)

//     const options = {
//       maxAge: 1000 * 60 * 60 * 24,
//       domain: 'localhost',
//       path: '/',
//     }
//     res.cookie('auth_token', token, options)

//     return res.status(200).json({
//       username : result.rows[0].username,
//       message: "ok"
//     })

//   } catch (error: any) {
//     console.log(error)
//     res.status(500).json({ message: error.message })
//   } finally {
//     client.release()
//   }
// }

// const logout = async(req:Request,res:Response) => {
//   const token = req.cookies?.auth_token
//   if(!token){
//     return res.status(403).json({message : "Authentication error"})
//   }
//   try {
//     const options = {
//       maxAge: 1000 * 60 * 60 * 24,
//       domain: 'localhost',
//       path: '/',
//     }
//     res.clearCookie("auth_token",options)

//     return res.status(200).json({message : "User logged out successfully"})
//   } catch (error : any) {
//     return res.status(400).json({message : error.message})
//   }
// }

// export {
//   signin,
//   signup,
//   logout
// }




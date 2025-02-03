import express from "express";
import cors from 'cors'
import { connectDB } from "./db";

import dotenv from 'dotenv'
dotenv.config()

import indexRouter from './routes/index'
import { disconnect } from "mongoose";


const app = express();
const port: number | string = process.env.port || 5500

app.use(express.json())
app.use(cors())

app.use('/api/v1', indexRouter)
app.get('/api/v1/health', async(req:express.Request,res:express.Response)=>{
  res.status(200).json({message:"server is health"})
})


const server = async()=>{
  try {
    await connectDB(process.env.MONGO_URI!)
    app.listen(port, () => console.log(`server started on port : ${port}`))
  } catch (error) {
    console.log("error connecting database")
    await disconnect()
  }
}

server()


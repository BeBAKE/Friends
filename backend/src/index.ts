import express from "express";
import cors from 'cors'
import { connectDB } from "./db";

import dotenv from 'dotenv'
dotenv.config()

import indexRouter from './routes/index'


const app = express();
const port: number | string = process.env.port || 5500

app.use(express.json())
app.use(cors())

app.use('/api/v1', indexRouter)


const server = async()=>{
  try {
    await connectDB(process.env.MONGO_URI!)
    app.listen(port, () => console.log(`server started on port : ${port}`))
  } catch (error) {
    console.log("error connecting database")
  }
}

server()


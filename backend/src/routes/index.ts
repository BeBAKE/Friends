import express, { Router } from "express";
import userRouter from './user'
import friendsRouter from './friends'

const router: Router = express.Router()

router.use('/user', userRouter)
router.use('/friends',friendsRouter)

export default router



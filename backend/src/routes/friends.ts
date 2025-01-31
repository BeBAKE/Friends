import { Router } from 'express'
import * as friend from '../controller/friends'
import { auth } from '../middleware/auth'

const router = Router()


router.get('/', auth, friend.getFriends )
router.get('/recommendations', auth, friend.recommendations )
router.get('/requests', auth, friend.getFriendReq )
router.post('/requests', auth, friend.sendFriendReq )
router.patch('/requests/:id', auth, friend.dealWithReq )
router.delete('/:friendId', auth, friend.removeFriend )


export default router



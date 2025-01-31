
import User, { IUser } from '../model/user'
import FriendRequest from '../model/friends'
import { Response } from 'express'
import { IRequest } from '../middleware/auth'


// Get friends list
export const getFriends = async (req: IRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('friends', 'username')
    res.status(200).json({ success:true, data :user?.friends || []})
  } catch (error) {
    res.status(500).json({ success:false, message: 'Failed to fetch friends' })
  }
};

// Get friend recommendations
export const recommendations = async (req: IRequest, res: Response) => {
  try {
    const userId = req.user?._id
    const user = await User.findById(userId) as IUser

    const recommendations = await User.aggregate([
      { 
        $match: { 
          _id: { $ne: userId },
          friends: { $nin: [userId] } 
        }
      },
      {
        $project: {
          username: 1,
          mutualFriends: {
            $size: {
              $setIntersection: ["$friends", user.friends]
            }
          }
        }
      },
      { $sort: { mutualFriends: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({ success:true, data :recommendations});
  } catch (error) {
    res.status(500).json({ success:false, message: 'Failed to get recommendations' });
  }
}

// Get friend requests
export const getFriendReq = async (req: IRequest, res: Response) => {
  try {
    const requests = await FriendRequest.find({ 
      to: req.user?._id,
      status: 'pending'
    }).populate('from', 'username');
    
    res.status(200).json({ success:true, data :requests});
  } catch (error) {
    res.status(500).json({ success:false, message: 'Failed to fetch requests' });
  }
}

// Send friend request
export const sendFriendReq = async (req: IRequest, res: Response) => {
  try {
    const { userId } = req.body;
    const from = req.user?._id;

    if (!userId) {
      res.status(400).json({ success:false, message: 'User ID required' })
      return 
    }

    const existingRequest = await FriendRequest.findOne({
      from,
      to: userId,
      status: 'pending'
    });

    if (existingRequest) {
      res.status(400).json({ success:false, message: 'Request already sent' })
      return 
    }

    const request = new FriendRequest({
      from,
      to: userId,
      status: 'pending'
    });

    await request.save();
    res.status(201).json({ success:true, data :request});
  } catch (error) {
    res.status(500).json({ success:false, message: 'Failed to send request' });
  }
};

// Accept/Reject friend request
export const dealWithReq = async (req: IRequest, res: Response) => {
  try {
    const { status } = req.body;
    const request = await FriendRequest.findById(req.params.id)
    console.log(request)
    if (!request) {
      res.status(404).json({ success:false, message: 'Request not found' })
      return 
    }

    if (request.to.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success:false, message: 'Unauthorized' })
      return 
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await User.findByIdAndUpdate(request.from, {
        $addToSet: { friends: request.to }
      });
      await User.findByIdAndUpdate(request.to, {
        $addToSet: { friends: request.from }
      });
    }

    const message = `Request ${status === "accepted" ? "accepted" : "rejected"}`
    res.status(200).json({ success:true, data : request, message});
  } catch (error) {
    console.log(error)
    res.status(500).json({ success:false, message: 'Failed to update request' });
  }
};

// Remove friend
export const removeFriend = async (req: IRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const friendId = req.params.friendId;

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId }
    });

    res.json({ success : true, message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ success:false, message: 'Failed to remove friend' });
  }
}
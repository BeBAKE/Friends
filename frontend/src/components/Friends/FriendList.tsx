import { User } from '../../types';
import api from '../../api/client';
import { toast } from 'react-toastify';

interface FriendListProps {
  friends: User[];
  onUnfriend?: (friendId: string) => void;
}

const FriendList = ({ friends, onUnfriend }: FriendListProps) => {

  const handleUnfriend = async (friendId: string) => {
    try {
      await api.delete(`/friends/${friendId}`);
      onUnfriend?.(friendId);
      toast.success("removed from friend list")
    } catch (error) {
      console.error('Failed to unfriend:', error);
      toast.error("something went wrong")
    }
  };

return (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Friends ({friends.length})</h2>
    <div className="space-y-3">
      {friends.map(friend => (
        <div key={friend._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">{friend.username[0]}</span>
            </div>
            <span className="font-medium text-gray-700">{friend.username}</span>
          </div>
          <button
            onClick={() => handleUnfriend(friend._id)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Unfriend
          </button>
        </div>
      ))}
    </div>
  </div>
);
};

export default FriendList;
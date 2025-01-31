import { FriendRecommendation } from '../../types';
import api from '../../api/client';
import { toast } from 'react-toastify';

interface RecommendationsProps {
  recommendations: FriendRecommendation[];
}

const FriendRecommendations = ({ recommendations }: RecommendationsProps) => {
  const handleAddFriend = async (userId: string) => {
    try {
      await api.post('/friends/requests', { userId });
      toast.success("Sent a friend request")
    } catch (error:any) {
      console.error('Failed to send request:', error);
      toast.error(error.response.data.message)
    }
  };



  return (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Suggestions</h2>
    <div className="space-y-4">
      {recommendations.map(user => (
        <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium">{user.username[0]}</span>
            </div>
            <div>
              <p className="font-medium text-gray-700">{user.username}</p>
              <p className="text-sm text-gray-500">{user.mutualFriends} mutual friends</p>
            </div>
          </div>
          <button
            onClick={() => handleAddFriend(user._id)}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  </div>
);

};

export default FriendRecommendations;
import { FriendRequest } from '../../types';
import api from '../../api/client';

interface FriendRequestsProps {
  requests: FriendRequest[];
}

const FriendRequests = ({ requests }: FriendRequestsProps) => {

  const handleRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/friends/requests/${requestId}`, { status });
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };


  return (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Friend Requests ({requests.length})</h2>
    <div className="space-y-3">
      {requests.map(request => (
        <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-medium">{request.from.username[0]}</span>
            </div>
            <span className="font-medium text-gray-700">{request.from.username}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleRequest(request._id, 'accepted')}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleRequest(request._id, 'rejected')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default FriendRequests;
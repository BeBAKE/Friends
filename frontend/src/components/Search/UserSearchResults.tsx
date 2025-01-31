import { UserSearchResult } from "../../types";

interface UserSearchResultsProps {
  results: UserSearchResult[];
  onAddFriend: (userId: string) => void;
}

const UserSearchResults = ({ results, onAddFriend }: UserSearchResultsProps) => 
  
{
  return (
  <div className="mt-4 space-y-2">
    {results.length > 0 ? (
      results.map(user => (
        <div 
          key={user._id}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-medium text-blue-600">{user.username[0]}</span>
            </div>
            <div>
              <span className="font-medium text-gray-800">{user.username}</span>
              {user.mutualFriends > 0 && (
                <span className="block text-sm text-gray-500">
                  {user.mutualFriends} mutual friends
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onAddFriend(user._id)}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Add Friend
          </button>
        </div>
      ))
    ) : (
      <div className="p-6 text-center text-gray-500 bg-white rounded-xl">
        No users found
      </div>
    )}
  </div>
  )

  
}

export default UserSearchResults;
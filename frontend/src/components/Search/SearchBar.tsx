import { useState, useEffect } from 'react';
import { UserSearchResult } from '../../types';
import UserSearchResults from './UserSearchResults';
import api from '../../api/client';
import { toast } from 'react-toastify';

interface SearchBarProps {
  onSearch: (query: string) => Promise<UserSearchResult[]|[]>;
}
// onSearch - [] or User[]
const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onAddFriend = async (userId:string) => {
    try {
      await api.post('/friends/requests', { userId });
      toast.success("Sent a friend Request")
    } catch (error:any) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        try {
          const data = await onSearch(query);
          setResults(data);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      }else{
        setResults([])
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);


  return (
  <div className="w-full mx-auto">
    <div className="relative">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isSearching && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
    
    <UserSearchResults 
      results={results} 
      onAddFriend={onAddFriend}
    />
  </div>
);
};

export default SearchBar;
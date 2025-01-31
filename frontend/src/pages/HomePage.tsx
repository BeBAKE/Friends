import { useEffect, useState } from 'react';
import { User, FriendRequest, FriendRecommendation, UserSearchResult } from '../types';
import api from "../api/client";
import FriendList from '../components/Friends/FriendList';
import FriendRecommendations from '../components/Friends/FriendRecommendations';
import SearchBar from '../components/Search/SearchBar';
import FriendRequests from '../components/Friends/FriendRequests';

export type AggregatedUserSearchResult = (User & UserSearchResult)

const HomePage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [recommendations, setRecommendations] = useState<FriendRecommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsRes, requestsRes, recsRes] = await Promise.all([
          api.get<User[]>('/friends'),
          api.get<FriendRequest[]>('/friends/requests'),
          api.get<FriendRecommendation[]>('/friends/recommendations')
        ]);
        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
        setRecommendations(recsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      const { data } = await api.get<AggregatedUserSearchResult[]>(`/user/search?q=${query}`);
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };


    return (
      <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              <div className="lg:col-span-3 space-y-6">
                <SearchBar onSearch={handleSearch} />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FriendRequests requests={requests} />
                  <FriendList friends={friends} />
                </div>
              </div>
    
              
              <div className="lg:col-span-1">
                <FriendRecommendations recommendations={recommendations} />
              </div>
            </div>
          </div>
        </div>
  )


  
};

export default HomePage;
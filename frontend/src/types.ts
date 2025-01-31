// User and Authentication Types
export interface User {
  _id: string;
  email: string;
  username: string;
  friends: string[];
  interests?: string[];
}

export interface UserCredentials {
  email: string;
  username?: string;
  password: string;
}

// Friend Request Types
export interface FriendRequest {
  _id: string;
  from: Record<string,string>; //string | 
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Recommendation Types
export interface FriendRecommendation extends User {
  mutualFriends: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

// Search Results
export interface UserSearchResult {
  _id: string;
  username: string;
  mutualFriends: number;
}
export interface UserCredentials {
  email: string
  username: string
  password: string
}

export interface FriendRequest {
  from: string,
  to: string,
  status: 'pending' | 'accepted' | 'rejected'
}
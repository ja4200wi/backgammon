// UserContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import {
  getFriendships,
  getPlayerInfo,
  getUserName,
} from '../service/profileService';
import { SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

type Friend = {
  friend: PlayerInfo;
  friendShip: Friendship;
};

const playerSelectionSet = [
  'id',
  'name',
  'country',
  'emoji',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<
  Schema['Player']['type'],
  typeof playerSelectionSet
>;

const friendshipSelectionSet = [
  'id',
  'userIdOne',
  'userIdTwo',
  'isConfirmed',
  'createdAt',
] as const;
type Friendship = SelectionSet<
  Schema['Friends']['type'],
  typeof friendshipSelectionSet
>;

interface UserContextType {
  userInfo: PlayerInfo | null;
  friends: Friend[] | null;
  loading: boolean;
  refetchUserData: () => Promise<void>; // Add refetchUserData function to the context type
}

interface UserProviderProps {
  children: ReactNode;
}

// Create the context with an initial default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userInfo, setUserInfo] = useState<PlayerInfo | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = await getUserName();
      const userInfo = await getPlayerInfo(userId);
      userInfo && setUserInfo(userInfo);
    } catch (error) {
      console.error('Failed to load user data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    const userId = await getUserName();
    const friendShips = await getFriendships(userId);
    const friendList = await Promise.all(
      friendShips
        .filter((friendShip) => friendShip !== null)
        .map(async (friendShip) => {
          const friendId =
            friendShip.userIdOne === userId
              ? friendShip.userIdTwo
              : friendShip.userIdOne;
          const friend = await getPlayerInfo(friendId!);
          if (friend === null) return { friend: null, friendShip: null };
          return { friend, friendShip };
        })
    );
    setFriends(
      friendList.filter(
        (friend) => friend.friend !== null && friend.friendShip !== null
      )
    );
  };

  useEffect(() => {
    fetchUserData();
    fetchFriends();
  }, []);

  // Provide user data, loading state, and the refetch method to the context
  return (
    <UserContext.Provider
      value={{ userInfo, friends, loading, refetchUserData: fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the UserContext with proper type checking
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

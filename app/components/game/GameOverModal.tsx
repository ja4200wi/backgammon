import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements'; // Ensure this is installed and set up
import CountryFlag from 'react-native-country-flag'; // Ensure this is installed and set up
import Profile from '../../images/profile.svg'; // Ensure your SVG import is correct
import { APP_COLORS, COUNTRIES } from '../../utils/constants';
import { SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { getEnumFromKey, getPlayerInfo } from '../../service/profileService';
import CustomAlert from '../misc/customAlert';

const selectionSet = [
  'id',
  'name',
  'emoji',
  'country',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

const GameOverModal = ({
  visible,
  winner,
  onAccept,
  onDecline,
}: {
  visible: boolean;
  winner: string | null;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  const [username, setUsername] = useState<string | null>(null);

  const updateUsername = async () => {
    const info = await getPlayerInfo(winner!);
    if (info === null) {
      setUsername(winner);
      return;
    }
    setUsername(info.name);
  };

  useEffect(() => {
    updateUsername();
  }, [winner]);
  return (
    <CustomAlert
      visible={visible}
      headline={username === 'You' ? 'You win the Game' : `${username} wins the Game`}
      bodyText='What would you like to do?'
      acceptButtonText='Play Again'
      declineButtonText='Go to Home'
      onAccept={onAccept}
      onDecline={onDecline}
    />
  );
};

export default GameOverModal;

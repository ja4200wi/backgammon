import { useAuthenticator } from '@aws-amplify/ui-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import {
  getColor,
  getCountry,
  getEmail,
  getEmoji,
  getPlayerInfo,
  getUserName,
  updateColor,
  updateCountry,
  updateEmoji,
  updatePlayerName,
} from '../../service/profileService';
import { SelectList } from 'react-native-dropdown-select-list';
import { COUNTRIES } from '../../utils/constants';
import { useUser } from '../../utils/UserContent';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function EditProfileForm() {
  const { userInfo, refetchUserData } = useUser();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [country, setCountry] = useState('');

  const countries = [
    { key: 'us', value: 'United States' },
    { key: 'ca', value: 'Canada' },
    { key: 'gb', value: 'United Kingdom' },
    { key: 'de', value: 'Germany' },
    { key: 'fr', value: 'France' },
    { key: 'it', value: 'Italy' },
    { key: 'es', value: 'Spain' },
    { key: 'au', value: 'Australia' },
    { key: 'br', value: 'Brazil' },
    { key: 'jp', value: 'Japan' },
    { key: 'cn', value: 'China' },
    { key: 'in', value: 'India' },
    { key: 'mx', value: 'Mexico' },
    { key: 'ru', value: 'Russia' },
    { key: 'za', value: 'South Africa' },
    { key: 'kr', value: 'South Korea' },
    { key: 'nl', value: 'Netherlands' },
    { key: 'se', value: 'Sweden' },
    { key: 'ch', value: 'Switzerland' },
    { key: 'tr', value: 'Turkey' },
    { key: 'ar', value: 'Argentina' },
    { key: 'sa', value: 'Saudi Arabia' },
    { key: 'ae', value: 'United Arab Emirates' },
    { key: 'be', value: 'Belgium' },
    { key: 'no', value: 'Norway' },
    { key: 'pl', value: 'Poland' },
    { key: 'pt', value: 'Portugal' },
    { key: 'dk', value: 'Denmark' },
    { key: 'ie', value: 'Ireland' },
    { key: 'il', value: 'Israel' },
  ];

  const colors = [
    { key: '#FFFFFF', value: 'white' },
    { key: '#000000', value: 'black' },
  ];

  const SignOutButton = () => {
    const { signOut } = useAuthenticator();

    return (
      <View style={{ zIndex: 2 }}>
        <Button title='Sign Out' onPress={signOut} />
      </View>
    );
  };

  const getUserData = async () => {
    const email = await getEmail();
    setName(userInfo?.name || '');
    setEmail(email);
    setEmoji(userInfo?.emoji || '');
    setCountry(userInfo?.country || 'de');
    setColor(userInfo?.profilePicColor || '#000000');
  };

  const handleSubmit = async () => {
    if (emoji.length > 2) {
      Alert.alert('Please enter a single emoji or up to two characters');
      return;
    }
    await updatePlayerName(userInfo?.id!, name);
    country && (await updateCountry(userInfo?.id!, country));
    emoji && (await updateEmoji(userInfo?.id!, emoji));
    colors && (await updateColor(userInfo?.id!, color));
    console.log('Profile updated', name, country, emoji, color);
    refetchUserData();
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <SignOutButton />
      <Input
        label='Name'
        value={name}
        onChangeText={setName}
        placeholder='Enter your name'
      />
      <Input
        label='Email'
        value={email}
        onChangeText={setEmail}
        disabled={true}
        placeholder='Enter your email'
        onPress={() => Alert.alert('Email cannot be changed yet')}
      />
      <Input
        label='Emoji'
        value={emoji}
        onChangeText={setEmoji}
        placeholder='Enter your emoji or two characters'
      />
      <SelectList
        setSelected={(val: string) => setCountry(val)}
        data={countries}
        defaultOption={countries.find((d) => d.key === country)}
        save='key'
        dropdownTextStyles={{ color: 'black' }}
      />
      <View style={{ height: 16 }} />
      <SelectList
        setSelected={(val: string) => setColor(val)}
        data={colors}
        defaultOption={colors.find((d) => d.key === color)}
        save='key'
        dropdownTextStyles={{ color: 'black' }}
      />
      <Button title='Submit' onPress={handleSubmit} disabled={loading} />
      {error ? <Text>{error}</Text> : null}
      {success ? <Text>Profile updated successfully</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

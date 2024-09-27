import { useAuthenticator } from '@aws-amplify/ui-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import {
  getCountry,
  getEmail,
  getPlayerInfo,
  getUserName,
  updateCountry,
  updatePlayerName,
} from '../../service/profileService';
import { SelectList } from 'react-native-dropdown-select-list';
import { COUNTRIES } from '../../utils/constants';
import { useUser } from '../../utils/UserContent';

export default function EditProfileForm() {
  const userId = useUser().userInfo?.name;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [country, setCountry] = useState('');

  const data = [
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

  const getUserData = async () => {
    const info = await getPlayerInfo(userId!);
    const email = await getEmail();
    const fetchCountry = await getCountry(userId!);
    setName(info?.name || '');
    setEmail(email);
    setCountry(fetchCountry);
  };

  const handleSubmit = async () => {
    await updatePlayerName(userId!, name);
    await updateCountry(userId!, country);
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <View style={styles.container}>
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
      <SelectList
        setSelected={(val: string) => setCountry(val)}
        data={data}
        defaultOption={data.find((d) => d.key === country)}
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

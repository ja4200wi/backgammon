import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import {
  getEmail,
  getPlayerInfo,
  getUserName,
  updatePlayerName,
} from '../../service/profileService';

export default function EditProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getUserData = async () => {
    const info = await getPlayerInfo(await getUserName());
    const email = await getEmail();
    setName(info?.name || '');
    setEmail(email);
  };

  const handleSubmit = async () => {
    await updatePlayerName(await getUserName(), name);
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
      <Input
        label='Country'
        value={country}
        onChangeText={setCountry}
        placeholder='Enter your country'
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

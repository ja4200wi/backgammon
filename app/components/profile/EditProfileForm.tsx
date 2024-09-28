import { useAuthenticator } from '@aws-amplify/ui-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';
import { Icon, Input } from 'react-native-elements';
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
import { APP_COLORS, COUNTRIES } from '../../utils/constants';
import { useUser } from '../../utils/UserContent';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function EditProfileForm({ onSubmit }: { onSubmit: () => void }) {
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
    { key: '#3498DB', value: 'sky blue' },
    { key: '#E74C3C', value: 'crimson red' },
    { key: '#2ECC71', value: 'emerald green' },
    { key: '#9B59B6', value: 'purple' },
    { key: '#F39C12', value: 'orange' },
    { key: '#1ABC9C', value: 'turquoise' },
    { key: '#34495E', value: 'midnight blue' },
    { key: '#95A5A6', value: 'gray' },
    { key: '#FFC300', value: 'sun yellow' },
    { key: '#D35400', value: 'carrot orange' },
    { key: '#7D3C98', value: 'amethyst' },
    { key: '#2C3E50', value: 'dark slate' },
    { key: '#16A085', value: 'teal' },
  ];

  const SignOutButton = () => {
    const { signOut } = useAuthenticator();

    return (
      <View style={{ zIndex: 2 }}>
        <Button type='clear' title='Sign Out' onPress={signOut} />
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
    setLoading(true);
    try {
      await updatePlayerName(userInfo?.id!, name);
      country && (await updateCountry(userInfo?.id!, country));
      emoji && (await updateEmoji(userInfo?.id!, emoji));
      color && (await updateColor(userInfo?.id!, color));
      
      console.log('Profile updated', name, country, emoji, color);
      refetchUserData();
      
      // Close the modal after a successful submit
      onSubmit();
    } catch (error) {
      setError('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
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
      <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-evenly',marginTop:16}}>
      <Button buttonStyle={{borderRadius:15}} title='Save' onPress={handleSubmit} disabled={loading} icon={{
                name: 'save',
                type: 'material',
                size: 24,
                color: 'white',
              }}>
      </Button>
      {error ? <Text>{error}</Text> : null}
      {success ? <Text>Profile updated successfully</Text> : null}
      <Button type='clear' title='Close' onPress={onSubmit} />
      </View>

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

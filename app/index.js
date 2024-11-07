import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log("respose",response);
      
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        // Navigate to the home screen or set the user as logged in
        router.push('/home'); // Navigate to home on successful login
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {/* Logo or any other image */}
      <Image
        source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.SipX3cbdr3RwDThaeB_KygHaH0&pid=Api&P=0&h=180' }} // Replace with your image URL or local path
        style={{ width: 100, height: 100, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* Login Form */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ width: '100%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ width: '100%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5 }}
      />

      {/* Login Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

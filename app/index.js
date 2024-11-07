import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    setLoading(true);
    if(!email || !password){
      Alert.alert("Email and Password are required to Login !!")
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        router.push('/Home');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
  };

  const handleRegister = () => {
    console.log('Navigate to Register screen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.SipX3cbdr3RwDThaeB_KygHaH0&pid=Api&P=0&h=180' }}
        style={styles.image}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <View style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </View>
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
      <View style={styles.googleLoginContainer}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
          <Image
            source={{ uri: 'https://tse2.mm.bing.net/th?id=OIP.mVfYLYPIF9w_J5nhVEO6fAHaHa&pid=Api&P=0&h=180' }}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>New to Logistics? <Text style={{color:'#007BFF'}}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f3f4f6'
  },
  image: { 
    width: 100, 
    height: 100, 
    marginBottom: 20, 
    borderRadius: 10 
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderBottomWidth: 1, 
    borderColor: '#ccc',  
    fontSize: 16,         
  },
  buttonContainer: {
    width: '100%',   
    marginTop: 20, 
    paddingVertical: '10px',

  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',  
    marginTop: 10,          
  },
  forgotPasswordText: {
    color: '#007BFF',  
    fontSize: 14,
    fontWeight: 500      
  },
  googleLoginContainer: {
    marginTop: 20, 
    width: '100%',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 5,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color:'#A9A9A9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    color: '#A9A9A9',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

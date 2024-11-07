import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Logout" onPress={handleLogout} />
      <TextInput
        placeholder="Search Products"
        value={search}
        onChangeText={setSearch}
        style={{ marginVertical: 16 }}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
      <Button title="Add Product" onPress={() => router.push('/home/add-product')} />
    </View>
  );
}

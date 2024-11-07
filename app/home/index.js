import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Material Icons
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Fetch products from AsyncStorage
  const fetchProducts = async () => {
    const storedProducts = await AsyncStorage.getItem('products');
    const parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];
    setProducts(parsedProducts);
  };

  // Use useFocusEffect to refetch products when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Handle logout functionality
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
  };

  // Filter products based on search text
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            // Filter out the product from the list
            const updatedProducts = products.filter(product => product.id !== id);
            // Update the AsyncStorage with the new product list
            await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
            // Update the state with the new product list
            setProducts(updatedProducts);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Render each product card
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteProduct(item.id)} // Passing product id to delete
      >
        <Icon name="delete" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          placeholder="Search Products"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor is working properly
        contentContainerStyle={styles.productList}
      />

      {/* Floating Add Product Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/home/add-product')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f9' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    width: '80%', // Take most of the width for the search bar
  },
  logoutButton: {
    backgroundColor: '#4CAF50', // Green color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  productList: {
    marginTop: 16,
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative', // To position the delete button inside the card
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginVertical: 8,
  },
  deleteButton: {
    position: 'absolute', // Positioning it inside the card
    top: '50%', // Vertically centering it
    right: 8, // Keeping it on the right
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensures it stays on top of other elements
    transform: [{ translateY: -25 }], // Adjusting to perfectly center vertically
  },
  
  addButton: {
    position: 'absolute', // Positioning it at the bottom right
    bottom: 16,
    right: 16,
    backgroundColor: '#4CAF50', // Green color for Add Product button
    width: 50,
    height: 50,
    borderRadius: 30, // Full circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

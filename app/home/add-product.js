import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProductScreen() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const router = useRouter();

  // Image picker function
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // maximum quality
    });

    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // Compress the image
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize the image to width of 800px (you can adjust this value)
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress to 50% quality
      );
      
      setImageUri(compressedImage.uri); // Update the URI with the compressed image URI
    }
  };

  // Function to handle adding product
  const handleAddProduct = async () => {
    if (!productName || !price || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    // Check for duplicate product based on name and image URI
    const storedProducts = await AsyncStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];

    const isDuplicate = products.some(product => 
      product.name.toLowerCase() === productName.toLowerCase() || product.image === imageUri
    );
    

    if (isDuplicate) {
      Alert.alert('Error', 'This product already exists');
      return;
    }

    // Add the new product if no duplicate is found
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price,
      image: imageUri, // Store the URI of the compressed image
    };

    // Add the new product to AsyncStorage
    await AsyncStorage.setItem('products', JSON.stringify([...products, newProduct]));

    // Navigate back to the previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Product Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#f4f4f9' },
  header: { fontSize: 28, fontWeight: '600', marginBottom: 24, textAlign: 'center', color: '#2e2e2e' },
  input: {
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 16, 
    borderColor: '#ddd', 
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  imagePicker: {
    backgroundColor: '#e6f7ff', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 16, 
    alignItems: 'center', 
    borderColor: '#b3d9ff', 
    borderWidth: 1,
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  imagePickerText: { color: '#6fa3d6', fontSize: 16 },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    shadowColor: '#4CAF50', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

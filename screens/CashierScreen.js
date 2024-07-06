import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { DataTable } from 'react-native-paper';
import { Audio } from 'expo-av';
import { getProduct } from '../database/db';

const CashierScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermission();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/read.mp3'));
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const product = await getProduct(data);
    playSound();
    if (product) {
      setProducts((prevProducts) => {
        const existingProduct = prevProducts.find(p => p.barcode === data);
        if (existingProduct) {
          existingProduct.quantity += 1;
          return [...prevProducts];
        } else {
          return [...prevProducts, { ...product, quantity: 1 }];
        }
      });
    } else {
      Alert.alert('Ürün bulunamadı', `Barkod ${data} ile ürün bulunamadı.`);
    }
    setTimeout(() => setScanned(false), 2000); // 2 saniye gecikme ekledik
  };

  const calculateTotal = () => {
    let total = 0;
    products.forEach(product => {
      total += product.price * product.quantity;
    });
    setTotalPrice(total);
  };

  const handleIncrease = (index) => {
    const newProducts = [...products];
    newProducts[index].quantity += 1;
    setProducts(newProducts);
  };

  const handleDecrease = (index) => {
    const newProducts = [...products];
    if (newProducts[index].quantity > 1) {
      newProducts[index].quantity -= 1;
      setProducts(newProducts);
    }
  };

  const handleDelete = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const renderActions = (index) => (
    <View style={styles.actionsCell}>
      <TouchableOpacity onPress={() => handleIncrease(index)} style={styles.touchableButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDecrease(index)} style={styles.touchableButton}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  if (hasPermission === null) {
    return <Text>Kamera izni isteniyor...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Kameraya erişim izni yok</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      {showCamera && ( <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        /> )}
        <TouchableOpacity onPress={() => setShowCamera(!showCamera)} style={styles.closeButton}>
          <Text style={styles.buttonText}>{showCamera ? 'Kamerayı Kapat' : 'Kamerayı Aç'}</Text>
        </TouchableOpacity>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>İsim</DataTable.Title>
            <DataTable.Title>Barkod</DataTable.Title>
            <DataTable.Title>Adet</DataTable.Title>
            <DataTable.Title>Fiyat</DataTable.Title>
            <DataTable.Title>İşlemler</DataTable.Title>
          </DataTable.Header>
          {products.map((product, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{product.name}</DataTable.Cell>
              <DataTable.Cell>{product.barcode}</DataTable.Cell>
              <DataTable.Cell>{product.quantity}</DataTable.Cell>
              <DataTable.Cell>{product.price.toFixed(2)}</DataTable.Cell>
              <DataTable.Cell>{renderActions(index)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Toplam Fiyat: {totalPrice.toFixed(2)}₺</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  camera: {
    height: 300,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  totalPriceContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CashierScreen;

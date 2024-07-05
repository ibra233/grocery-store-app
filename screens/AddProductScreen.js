import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFormikContext, Formik } from 'formik';
import * as Yup from 'yup';
import {
  insertProduct, createTables
} from '../database/db';
import { CameraView, Camera } from "expo-camera";
import { Audio } from 'expo-av';
const AddProductScreen = ({ navigation }) => {
  const [showCamera, setShowCamera] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [sound, setSound] = useState();
  const handleAddProduct = async (values) => {
    try {
      await createTables();
      await insertProduct(values.name, parseInt(values.quantity), values.barcode, parseFloat(values.price));
      alert('Product added successfully');
      navigation.goBack();
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Ürün İsmi Boş Bırakılamaz'),
    quantity: Yup.number().required('Adet Sayısı Boş Bırakılamaz').positive().integer(),
    barcode: Yup.string().required('Barcode boş bırakılamaz.'),
    price: Yup.number().required('Price is required').positive(),
  });

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setShowCamera(false)
    setBarcode(data);
    playSound();
  };
 
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../assets/read.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Formik
      initialValues={{ name: '', quantity: '', barcode: '', price: '' }}
      validationSchema={ProductSchema}
      onSubmit={handleAddProduct}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Ürün İsmi"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Adet"
            onChangeText={handleChange('quantity')}
            onBlur={handleBlur('quantity')}
            value={values.quantity}
            keyboardType="numeric"
          />
          {touched.quantity && errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Barkod"
            onChangeText={handleChange('barcode')}
            onBlur={handleBlur('barcode')}
            value={values.barcode = barcode}
          />
          {touched.barcode && errors.barcode && <Text style={styles.error}>{errors.barcode}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Fiyat"
            onChangeText={handleChange('price')}
            onBlur={handleBlur('price')}
            value={values.price}
            keyboardType="numeric"
          />
          {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}
          <Button title="Ürün Ekle" onPress={handleSubmit} />

          {showCamera && (<CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          />)}
          {scanned && (
            <TouchableOpacity style={styles.button} onPress={() => { setScanned(false) & setShowCamera(true) }} >
              <Text style={styles.buttonText}>Yeniden Tara</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  camera: {
    height: 200,
    marginTop: 20
  },
  button: {
    marginTop: 20,
    width: '30px',
    marginTop: 5,
    backgroundColor: '#4287f5',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff'
  }
});

export default AddProductScreen;

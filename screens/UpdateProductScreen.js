import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFormikContext, Formik } from 'formik';
import * as Yup from 'yup';
import { updateProduct, getProductById, createTables } from '../database/db';
import { CameraView, Camera } from "expo-camera";

const UpdateProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [showCamera, setShowCamera] = useState(true);
  const [name,setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity,setQuantity] = useState(0);
  const [price,setPrice] = useState(0);
  useEffect(() => {
    loadProductDetails();
  }, []);

  const loadProductDetails = async () => {
    try {
      const product = await getProductById(productId);
      console.log(product)
      setName(product.name);
      setQuantity(parseInt( product.quantity));
      setPrice(parseFloat(product.price));
      setBarcode(product.barcode);
    } catch (error) {
      alert('Error loading product details: ' + error.message);
    }
  };

  const handleUpdateProduct = async (values) => {
    try {
      await updateProduct(productId, values.name, parseInt(values.quantity), values.barcode, parseFloat(values.price));
      alert('Product updated successfully');
      navigation.goBack();
    } catch (error) {
      alert('Error updating product: ' + error.message);
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
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Formik
      initialValues={{ name:'', quantity:'', barcode: '', price: '' }}
      validationSchema={ProductSchema}
      onSubmit={handleUpdateProduct}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Ürün İsmi"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name=name}
          />
          {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Adet"
            onChangeText={handleChange('quantity')}
            onBlur={handleBlur('quantity')}
            keyboardType="numeric"
            value={values.quantity = quantity.toString()}
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
            value={values.price = price.toString()}
            keyboardType="numeric"
          />
          {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}
          <Button title="Ürün Güncelle" onPress={handleSubmit} />

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

export default UpdateProductScreen;

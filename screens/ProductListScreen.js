import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import { DataTable, Modal, Portal, Button, Provider } from 'react-native-paper';
import { getProducts, deleteProduct } from '../database/db';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts();
      setTotalItems(allProducts.length);
      setProducts(allProducts.slice(page * itemsPerPage, (page + 1) * itemsPerPage));
    } catch (error) {
      Alert.alert('Error', 'Error loading products: ' + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      Alert.alert('Success', 'Ürün başarıyla silindi.');
      loadProducts();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Error deleting product: ' + error.message);
      setModalVisible(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const handleUpdate = (id) => {
    navigation.navigate('Ürün Güncelle', { productId: id });
  };

  return (
    <Provider>
      <ScrollView>
        <View style={styles.container}>
          <DataTable>
            <DataTable.Header style={styles.headerBackground}>
              <DataTable.Title style={styles.cellName}>
                <Text style={styles.header}>İsim</Text>
                </DataTable.Title>
              <DataTable.Title style={styles.cellQuantity}>Adet</DataTable.Title>
              <DataTable.Title style={styles.cellBarcode}>Barkod</DataTable.Title>
              <DataTable.Title style={styles.cellPrice}>Ücret</DataTable.Title>
              <DataTable.Title style={styles.cellActions}>İşlemler</DataTable.Title>
            </DataTable.Header>
            {products.map((product, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={styles.cellName}>
                <Text style={{ flexWrap: 'wrap' }}>
              {product.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cellQuantity}>{product.quantity.toString()}</DataTable.Cell>
                <DataTable.Cell style={styles.cellBarcode}>
                  <Text style={{ flexWrap: 'wrap' }}>
                    {product.barcode}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.cellPrice}>{product.price.toString()}</DataTable.Cell>
                <DataTable.Cell style={styles.cellActions}>
                  <View style={styles.actionButtons}>
                    <Button onPress={() => handleUpdate(product.id)}>Güncelle</Button>
                    <Button onPress={() => confirmDelete(product.id)} color="red">Sil</Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <View style={styles.pagination}>
            <Button onPress={() => setPage(Math.max(page - 1, 0))}>Önceki</Button>
            <Text style={styles.paginationText}>
              {`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, totalItems)} of ${totalItems}`}
            </Text>
            <Button onPress={() => setPage(Math.min(page + 1, Math.ceil(totalItems / itemsPerPage) - 1))}>Sonraki</Button>
          </View>
          <Portal>
            <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <Text>Bu ürünü silmek istediğinize emin misiniz?</Text>
                <View style={styles.modalButtons}>
                  <Button onPress={handleDelete}>Evet</Button>
                  <Button onPress={() => setModalVisible(false)}>Hayır</Button>
                </View>
              </View>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cellName: {
    flex: 1,
    justifyContent: 'center',
  },
  cellQuantity: {
    flex: 1,
    justifyContent: 'center',
  },
  cellBarcode: {
    flex: 2,
    justifyContent: 'center',
  },
  cellPrice: {
    flex: 1,
    justifyContent: 'center',
  },
  cellActions: {
    flex: 2,
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'column',
  },
  headerBackground: {
    backgroundColor: '#0390fc'
  },
  header:{
    fontSize : 16,
    fontWeight: 'bold'
  }
});

export default ProductListScreen;

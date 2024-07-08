import React from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { createTables, deleteDatabase, importDatabaseFromExcel, exportDatabaseToExcel } from '../database/db';

const SettingsScreen = () => {
  const handleImportDatabase = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.assets) {
        await importDatabaseFromExcel(result.assets[0].uri);
        Alert.alert('Başarılı', 'Veritabanı başarıyla içe aktarıldı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Veritabanı içe aktarma hatası: ' + error.message);
    }
  };

  const handleExportDatabase = async () => {
    try {
      await exportDatabaseToExcel();
      Alert.alert('Başarılı', 'Veritabanı başarıyla dışa aktarıldı ve paylaşıldı.');
    } catch (error) {
      Alert.alert('Hata', 'Veritabanı dışa aktarma hatası: ' + error.message);
    }
  };

  const handleDeleteDatabase = async () => {
    try {
      await deleteDatabase();
      Alert.alert('Başarılı', 'Veritabanı başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Veritabanı silme hatası: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
      <Button title="Veritabanını İçe Aktar" onPress={handleImportDatabase} />
      <Button title="Veritabanını Dışa Aktar ve Paylaş" onPress={handleExportDatabase} />
      <Button title="Veritabanını Sil" onPress={handleDeleteDatabase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SettingsScreen;

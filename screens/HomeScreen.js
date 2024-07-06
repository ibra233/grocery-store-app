import React from 'react';
import { View, Button, StyleSheet,TouchableOpacity,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} title="Ürün Ekle" onPress={() => navigation.navigate('Ürün Ekle')} >
      <Text style={styles.buttonText}>Ürün Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} title="Ürün Listele" onPress={() => navigation.navigate('Ürün Listesi')} >
      <Text style={styles.buttonText}>Ürün Listele</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} title="Kasiyer" onPress={() => navigation.navigate('Kasiyer')} >
      <Text style={styles.buttonText}>Kasiyer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} title="Ayarlar" onPress={() => navigation.navigate('Ayarlar')} >
      <Text style={styles.buttonText}>Ayarlar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    padding: 20,
  },
  button:{
    alignItems: 'center',
    width:'30px',
    marginTop:5,
    backgroundColor: '#4287f5',
    padding:10
  },
  buttonText:{
    fontSize: 16,
    color: '#ffffff'
  }
});

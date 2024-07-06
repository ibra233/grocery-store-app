import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductListScreen from './screens/ProductListScreen';
import CashierScreen from './screens/CashierScreen';
import UpdateProductScreen from './screens/UpdateProductScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Anasayfa">
        <Stack.Screen name="Anasayfa" component={HomeScreen} />
        <Stack.Screen name="Ürün Ekle" component={AddProductScreen} />
        <Stack.Screen name="Ürün Listesi" component={ProductListScreen} />
        <Stack.Screen name="Kasiyer" component={CashierScreen} />
        <Stack.Screen name="Ürün Güncelle" component={UpdateProductScreen} />
        <Stack.Screen name="Ayarlar" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

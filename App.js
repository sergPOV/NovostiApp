import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import NewsScreen from './screens/NewsScreen';
import ContactsScreen from './screens/ContactsScreen';
import AboutScreen from './screens/AboutScreen';
import WebViewScreen from './screens/WebViewScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Новости') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Контакты') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'О нас') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        
        // ЗАГОЛОВОК
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        
        // ============================================================
        // 🎨 СТИЛЬ ПАНЕЛИ — ПЛАВАЮЩАЯ (как раньше)
        // ============================================================
        tabBarStyle: {
          position: 'absolute',           // плавающая панель
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          height: 70,
          paddingBottom: 12,
          paddingTop: 6,
          marginHorizontal: 16,           // отступы по бокам
          marginBottom: 12,               // поднята над низом
          borderRadius: 20,               // скругление углов
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Новости" component={NewsScreen} options={{ title: 'Новости' }} />
      <Tab.Screen name="Контакты" component={ContactsScreen} options={{ title: 'Контакты' }} />
      <Tab.Screen name="О нас" component={AboutScreen} options={{ title: 'О приложении' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
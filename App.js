import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import NewsScreen from './screens/NewsScreen';
import ContactsScreen from './screens/ContactsScreen';
import AboutScreen from './screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // ИКОНКИ
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
          
          // ЦВЕТА
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          
          // ЗАГОЛОВОК
          headerStyle: {
            backgroundColor: '#007AFF',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          
          // ============================================================
          // ТАБ-БАР (ПОДНЯТЫЙ ВАРИАНТ)
          // ============================================================
          tabBarStyle: {
            position: 'absolute',           // Делаем панель плавающей
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,              // Убираем верхнюю границу
            elevation: 12,                  // Тень (Android)
            shadowColor: '#000',            // Тень (iOS)
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            height: 70,                     // Высота панели
            paddingBottom: 12,
            paddingTop: 6,
            marginHorizontal: 16,           // Отступы по бокам
            marginBottom: 12,               // Отступ снизу (поднимаем панель)
            borderRadius: 20,               // Скругление углов
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 2,
          },
          
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen
          name="Новости"
          component={NewsScreen}
          options={{ title: 'Новости' }}
        />
        <Tab.Screen
          name="Контакты"
          component={ContactsScreen}
          options={{ title: 'Контакты' }}
        />
        <Tab.Screen
          name="О нас"
          component={AboutScreen}
          options={{ title: 'О приложении' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
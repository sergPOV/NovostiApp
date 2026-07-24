import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { colors } from './styles/styles';

import NewsScreen from './screens/NewsScreen';
import ContactsScreen from './screens/ContactsScreen';
import AboutScreen from './screens/AboutScreen';
import WebViewScreen from './screens/WebViewScreen';
import ThemeToggle from './components/ThemeToggle';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ============================================================
// НИЖНЯЯ ПАНЕЛЬ
// ============================================================
function MainTabs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = colors;

  // ⬇️ Выбираем цвет в зависимости от темы
  const activeColor = isDark ? '#7B61FF' : '#007AFF'; // фиолетовый в тёмной, синий в светлой

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
        // ⬇️ АКТИВНАЯ ВКЛАДКА — зависит от темы
        tabBarActiveTintColor: activeColor,
        // ⬇️ НЕАКТИВНАЯ ВКЛАДКА — СЕРЫЙ
        tabBarInactiveTintColor: isDark ? '#666666' : '#999999',
        
        // ⬇️ ВЕРХНЯЯ ПАНЕЛЬ — зависит от темы
        headerStyle: {
          backgroundColor: isDark ? '#1A1A2E' : activeColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <ThemeToggle />,
        
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: currentColors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          height: 70,
          paddingBottom: 12,
          paddingTop: 6,
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
          color: isDark ? '#CCCCCC' : '#666666',
        },
      })}
    >
      <Tab.Screen name="Новости" component={NewsScreen} options={{ title: 'Новости' }} />
      <Tab.Screen name="Контакты" component={ContactsScreen} options={{ title: 'Контакты' }} />
      <Tab.Screen name="О нас" component={AboutScreen} options={{ title: 'О приложении' }} />
    </Tab.Navigator>
  );
}

// ============================================================
// ГЛАВНОЕ ПРИЛОЖЕНИЕ
// ============================================================
function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ⬇️ Основной цвет приложения — зависит от темы
  const primaryColor = isDark ? '#7B61FF' : '#007AFF';

  return (
    <NavigationContainer theme={{
      colors: {
        background: isDark ? '#121212' : '#F5F5F5',
        card: isDark ? '#1E1E1E' : '#FFFFFF',
        text: isDark ? '#F5F5F5' : '#111111',
        border: isDark ? '#333333' : '#E0E0E0',
        primary: primaryColor,
      },
    }}>
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

// ============================================================
// ОБЁРТКА С ТЕМОЙ
// ============================================================
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
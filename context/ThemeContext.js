import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, setTheme } from '../styles/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setThemeState(savedTheme);
          setTheme(savedTheme);
        } else if (deviceTheme) {
          setThemeState(deviceTheme);
          setTheme(deviceTheme);
        }
      } catch (error) {
        console.error('Ошибка загрузки темы:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (error) {
      console.error('Ошибка сохранения темы:', error);
    }
  };

  // Используем useMemo, чтобы избежать лишних перерендеров
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
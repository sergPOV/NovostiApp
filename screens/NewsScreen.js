import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import NewsCard from '../components/NewsCard';
import { loadNews } from '../services/newsService';
import { globalStyles, colors, spacing, typography } from '../styles/styles';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const load = async () => {
    try {
      setError('');
      setLoading(true);
      setProgress(0);
      
      const data = await loadNews((current, total) => {
        setProgress(Math.round((current / total) * 100));
      });
      
      setNews(data);
      if (data.length === 0) {
        setError('Новостей не найдено');
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить новости.\nПроверьте подключение к интернету.');
      setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNews = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (err) {
      console.error('Ошибка открытия:', err);
      Alert.alert('Ошибка', 'Не удалось открыть новость');
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.sm, color: colors.gray, fontSize: 16 }}>
          Загрузка новостей...
        </Text>
        {progress > 0 && (
          <Text style={{ marginTop: spacing.sm, color: colors.primary, fontSize: 18, fontWeight: '600' }}>
            {progress}%
          </Text>
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      contentContainerStyle={globalStyles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListHeaderComponent={
        error ? (
          <View style={{ alignItems: 'center', padding: spacing.xl, marginBottom: spacing.lg, backgroundColor: '#FFF3E0', borderRadius: 12 }}>
            <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>⚠️</Text>
            <Text style={{ color: colors.error, fontSize: 16, textAlign: 'center' }}>{error}</Text>
            <Text style={{ color: colors.primary, fontSize: 15, marginTop: spacing.md, fontWeight: '500' }} onPress={load}>
              Нажмите, чтобы повторить
            </Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📭</Text>
          <Text style={{ fontSize: 16, color: colors.lightGray, textAlign: 'center' }}>
            Новостей не найдено
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <NewsCard item={item} onPress={() => openNews(item.url)} />
      )}
    />
  );
}
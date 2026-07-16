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
import SkeletonCard from '../components/SkeletonCard';
import { loadNewsFast, loadNewsDetails } from '../services/newsService';
import { globalStyles, colors, spacing } from '../styles/styles';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const load = async () => {
    try {
      setError('');
      setLoading(true);
      setIsDetailsLoading(false);

      // 1. БЫСТРАЯ ЗАГРУЗКА (только заголовки)
      const fastData = await loadNewsFast();
      setNews(fastData);
      setLoading(false);
      setIsDetailsLoading(true);

      // 2. ФОНОВАЯ ДОЗАГРУЗКА (детали для каждой новости)
      const detailedNews = [];
      for (let i = 0; i < fastData.length; i++) {
        const detailed = await loadNewsDetails(fastData[i]);
        detailedNews.push(detailed);
        // Обновляем список постепенно
        setNews([...detailedNews]);
      }
      setIsDetailsLoading(false);

    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить новости.\nПроверьте подключение к интернету.');
      setNews([]);
      setLoading(false);
      setIsDetailsLoading(false);
    } finally {
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

  // Показываем скелетоны во время загрузки
  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.sm, color: colors.gray, fontSize: 16 }}>
          Загрузка новостей...
        </Text>
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
          <View style={{
            alignItems: 'center',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            backgroundColor: '#FFF3E0',
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>⚠️</Text>
            <Text style={{ color: colors.error, fontSize: 16, textAlign: 'center' }}>{error}</Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 15,
                marginTop: spacing.md,
                fontWeight: '500',
              }}
              onPress={load}
            >
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
      renderItem={({ item }) => {
        // Если новость ещё загружается — показываем скелетон
        if (item.isLoading) {
          return <SkeletonCard />;
        }
        return <NewsCard item={item} onPress={() => openNews(item.url)} />;
      }}
    />
  );
}
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoryFilter from '../components/CategoryFilter';
import { loadNewsFast, loadNewsDetails } from '../services/newsService';
import { getCategoryKey } from '../utils/validators';
import { globalStyles, colors, spacing } from '../styles/styles';

export default function NewsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const flatListRef = useRef(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollOffset = useRef(0);

  const load = async (isRefresh = false) => {
    try {
      setError('');

      if (!isRefresh) {
        setLoading(true);
      }

      const fastData = await loadNewsFast();
      setNews(fastData);

      if (!isRefresh) {
        setLoading(false);
      }

      const detailedNews = [];
      for (let i = 0; i < fastData.length; i++) {
        const detailed = await loadNewsDetails(fastData[i]);
        detailedNews.push(detailed);
        setNews([...detailedNews]);
      }

      if (fastData.length === 0) {
        setError('Новостей не найдено');
      }

    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить новости.\nПроверьте подключение к интернету.');
      setNews([]);
      if (!isRefresh) {
        setLoading(false);
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    load(false);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const openNews = useCallback((url, title) => {
    navigation.navigate('WebView', {
      url: url,
      title: title || 'Новость',
    });
  }, [navigation]);

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'all') return news;
    
    return news.filter((item) => {
      const categoryKey = getCategoryKey(item.title, item.excerpt);
      return categoryKey === selectedCategory;
    });
  }, [news, selectedCategory]);

  // ⬇️ ОПТИМИЗАЦИЯ: мемоизация renderItem
  const renderItem = useCallback(({ item }) => {
    if (item.isLoading) {
      return <SkeletonCard />;
    }
    return (
      <NewsCard
        item={item}
        onPress={() => openNews(item.url, item.title)}
      />
    );
  }, [openNews]);

  // ⬇️ ОПТИМИЗАЦИЯ: keyExtractor
  const keyExtractor = useCallback((item) => item.id, []);

  // ⬇️ ОПТИМИЗАЦИЯ: getItemLayout (примерная высота карточки)
  const getItemLayout = useCallback((data, index) => ({
    length: 280, // примерная высота карточки с картинкой
    offset: 280 * index,
    index,
  }), []);

  if (loading) {
    return (
      <View style={[globalStyles.center, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.sm, color: isDark ? '#CCCCCC' : '#666666', fontSize: 16 }}>
          Загрузка новостей...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={filteredNews}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={globalStyles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={isDark ? '#1E1E1E' : '#FFFFFF'}
        />
      }
      onScroll={(event) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      // ⬇️ ОПТИМИЗАЦИЯ: настройки виртуализации
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
      windowSize={5}
      removeClippedSubviews={true}
      getItemLayout={getItemLayout}
      ListHeaderComponent={
        <>
          {error && (
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
                onPress={() => load(false)}
              >
                Нажмите, чтобы повторить
              </Text>
            </View>
          )}

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </>
      }
      ListEmptyComponent={
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📭</Text>
          <Text style={{ 
            fontSize: 16, 
            color: isDark ? '#EEEEEE' : '#666666',
            textAlign: 'center',
          }}>
            {selectedCategory === 'all' 
              ? 'Новостей не найдено' 
              : 'В этой категории новостей нет'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary,
              marginTop: spacing.md,
              fontWeight: '500',
            }}
            onPress={() => load(false)}
          >
            Обновить
          </Text>
        </View>
      }
    />
  );
}
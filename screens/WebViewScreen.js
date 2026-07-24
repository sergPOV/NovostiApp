import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing } from '../styles/styles';

export default function WebViewScreen({ route, navigation }) {
  const { url, title } = route.params || {};
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Высота статус-бара для Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  if (!url) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <Text style={{ color: isDark ? '#CCCCCC' : '#666666' }}>Ссылка не найдена</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Верхняя панель */}
      <View style={[
        styles.header,
        { 
          paddingTop: statusBarHeight + 4,
          backgroundColor: colors.primary,
        }
      ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Новость'}
        </Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            style={[styles.headerButton, !canGoBack && styles.disabled]}
            disabled={!canGoBack}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={canGoBack ? '#fff' : 'rgba(255,255,255,0.4)'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            style={[styles.headerButton, !canGoForward && styles.disabled]}
            disabled={!canGoForward}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={canGoForward ? '#fff' : 'rgba(255,255,255,0.4)'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => webViewRef.current?.reload()}
            style={styles.headerButton}
          >
            <Ionicons name="refresh-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
        }}
        startInLoadingState={false}
        style={styles.webview}
        containerStyle={{ flex: 1 }}
      />

      {/* Индикатор загрузки */}
      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: isDark ? 'rgba(18,18,18,0.9)' : 'rgba(255,255,255,0.85)' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.sm, color: isDark ? '#CCCCCC' : '#666666' }}>
            Загрузка...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: 8,
    minHeight: 48,
    zIndex: 10,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
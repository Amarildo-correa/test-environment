import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { Focusable, useFocusRestore } from '../focus';
import { articles } from '../content/articles';
import { ArticleCard, CARD_GAP } from '../components/ArticleCard';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { remember, isPreferred, register } = useFocusRestore(articles[0].id);
  const openArticle = useCallback(
    (id: string) => navigation.navigate('Detail', { id }),
    [navigation],
  );
  const openSearch = useCallback(
    () => navigation.navigate('Search', {}),
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Amazon Fire Stick</Text>
        <View style={styles.headerRight}>
          <Focusable
            onPress={openSearch}
            style={styles.searchButton}
            focusedStyle={styles.searchButtonFocused}
            accessibilityRole="button"
            accessibilityLabel="Buscar"
          >
            {focused => (
              <Text style={focused ? styles.searchTextFocused : styles.searchText}>
                Buscar
              </Text>
            )}
          </Focusable>
          <Text style={styles.headerOs}>VEGA OS</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Dois Text lado a lado: o template do Vega avisa que Text aninhado
          ainda não funciona. */}
      <View style={styles.titleRow}>
        <Text style={styles.titleOrange}>Hello </Text>
        <Text style={styles.titleWhite}>World</Text>
      </View>

      <View style={styles.grid}>
        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            preferred={isPreferred(article.id)}
            register={register}
            onFocusArticle={remember}
            onOpenArticle={openArticle}
          />
        ))}
      </View>
    </View>
  );
}

const title = { fontSize: px(110), fontWeight: 'bold' } as const;
const searchText = {
  color: colors.white,
  fontSize: px(30),
  fontWeight: 'bold',
} as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: safeArea.horizontal,
    paddingVertical: safeArea.vertical,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: px(40),
  },
  headerBrand: {
    color: colors.orange,
    fontSize: px(36),
    fontWeight: '600',
  },
  headerOs: {
    color: colors.white,
    fontSize: px(36),
    fontWeight: 'bold',
    letterSpacing: px(4),
  },
  searchButton: {
    paddingVertical: px(8),
    paddingHorizontal: px(28),
    borderWidth: px(4),
    borderColor: colors.divider,
  },
  searchButtonFocused: {
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  searchText,
  searchTextFocused: { ...searchText, color: colors.black },
  divider: {
    height: px(2),
    backgroundColor: colors.divider,
    marginTop: px(20),
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: px(30),
    marginBottom: px(30),
  },
  titleOrange: { ...title, color: colors.orange },
  titleWhite: { ...title, color: colors.white },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    rowGap: CARD_GAP,
  },
});

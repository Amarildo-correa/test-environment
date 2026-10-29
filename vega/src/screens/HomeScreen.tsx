import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { useFocusRestore } from '../focus';
import { articles } from '../content/articles';
import { ArticleCard, CARD_GAP } from '../components/ArticleCard';
import { Button } from '../components/Button';
import { useCardOptions } from '../components/CardOptions';
import { colors, px, safeArea, text, typography } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { remember, isPreferred, register, focusLast, lastKey } =
    useFocusRestore(articles[0].id);
  const openArticle = useCallback(
    (id: string) => navigation.navigate('Detail', { id }),
    [navigation],
  );
  const openSearch = useCallback(
    () => navigation.navigate('Search', {}),
    [navigation],
  );
  const openMyList = useCallback(
    () => navigation.navigate('MyList'),
    [navigation],
  );
  const options = useCardOptions({
    isScreenFocused: navigation.isFocused,
    lastKey,
    focusLast,
    onOpenArticle: openArticle,
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Amazon Fire Stick</Text>
        <View style={styles.headerRight}>
          <Button label="Minha lista" variant="secondary" onPress={openMyList} />
          <Button label="Buscar" variant="secondary" onPress={openSearch} />
          <Text style={styles.headerOs}>VEGA OS</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Dois Text lado a lado: o template do Vega avisa que Text aninhado
          ainda não funciona. */}
      <View style={styles.titleRow}>
        <Text style={styles.titleAccent}>Hello </Text>
        <Text style={styles.title}>World</Text>
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
            onLongPressArticle={options.open}
          />
        ))}
      </View>
      {options.panel}
    </View>
  );
}

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
    columnGap: px(24),
  },
  headerBrand: text(typography.headlineSm, colors.primary, '700'),
  headerOs: {
    ...text(typography.headlineSm, colors.textHigh, '700'),
    letterSpacing: px(4),
  },
  divider: {
    height: px(2),
    backgroundColor: colors.divider,
    marginTop: px(20),
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: px(24),
    marginBottom: px(24),
  },
  titleAccent: text(typography.displayMd, colors.primary, '700'),
  title: text(typography.displayMd, colors.textHigh, '700'),
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    rowGap: CARD_GAP,
  },
});

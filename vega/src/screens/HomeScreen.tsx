import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { Focusable, useFocusRestore } from '../focus';
import { Article, articles } from '../content/articles';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

type ArticleCardProps = {
  article: Article;
  preferred: boolean;
  register: (key: string) => (node: View | null) => void;
  onFocusArticle: (id: string) => void;
  onOpenArticle: (id: string) => void;
};

// Card memoizado com handlers estáveis (lista anti-padrões do porte para Vega).
const ArticleCard = memo(function ArticleCard({
  article,
  preferred,
  register,
  onFocusArticle,
  onOpenArticle,
}: ArticleCardProps) {
  const ref = useMemo(() => register(article.id), [register, article.id]);
  const handleFocus = useCallback(
    () => onFocusArticle(article.id),
    [onFocusArticle, article.id],
  );
  const handlePress = useCallback(
    () => onOpenArticle(article.id),
    [onOpenArticle, article.id],
  );

  return (
    <Focusable
      ref={ref}
      hasTVPreferredFocus={preferred}
      onFocus={handleFocus}
      onPress={handlePress}
      style={styles.card}
      focusedStyle={styles.cardFocused}
      accessibilityRole="button"
      accessibilityLabel={`${article.titleStart} ${article.titleEnd}`}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>
        {article.titleStart} {article.titleEnd}
      </Text>
      <Text style={styles.cardBody} numberOfLines={3} ellipsizeMode="tail">
        {article.body}
      </Text>
    </Focusable>
  );
});

export function HomeScreen({ navigation }: Props) {
  const { remember, isPreferred, register } = useFocusRestore(articles[0].id);
  const openArticle = useCallback(
    (id: string) => navigation.navigate('Detail', { id }),
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Amazon Fire Stick</Text>
        <Text style={styles.headerOs}>VEGA OS</Text>
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

const CARD_GAP = px(40);

const title = { fontSize: px(110), fontWeight: 'bold' } as const;

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
  card: {
    width: '31.5%',
    height: '46%',
    backgroundColor: colors.card,
    padding: px(32),
    // A borda existe sempre (transparente) para o foco não deslocar o layout.
    borderWidth: px(8),
    borderColor: 'transparent',
  },
  cardFocused: {
    borderColor: colors.white,
    transform: [{ scale: 1.05 }],
  },
  cardTitle: {
    color: colors.white,
    fontSize: px(38),
    fontWeight: 'bold',
    marginBottom: px(16),
  },
  cardBody: {
    color: colors.white,
    fontSize: px(30),
    lineHeight: px(42),
  },
});

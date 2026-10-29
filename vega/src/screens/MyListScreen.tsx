import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { useFocusRestore } from '../focus';
import { getArticle } from '../content/articles';
import type { Article } from '../content/articles';
import { useMyList } from '../content/myList';
import { ArticleCard, CARD_GAP } from '../components/ArticleCard';
import { useCardOptions } from '../components/CardOptions';
import { colors, px, safeArea, text, typography } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'MyList'>;

// Cards salvos pelo painel de opções ("Salvar na lista").
export function MyListScreen({ navigation }: Props) {
  const { ids } = useMyList();
  const saved = useMemo(
    () =>
      ids
        .map(id => getArticle(id))
        .filter((article): article is Article => article !== undefined),
    [ids],
  );
  const { remember, isPreferred, register, focusLast, lastKey } =
    useFocusRestore(saved[0]?.id ?? '');
  const openArticle = useCallback(
    (id: string) => navigation.navigate('Detail', { id }),
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
      <Text style={styles.title}>Minha lista</Text>
      {saved.length === 0 ? (
        <Text style={styles.empty}>
          Sua lista está vazia. Na Home, segure OK em um card (ou aperte o
          botão Menu ☰) e escolha “Salvar na lista”.
        </Text>
      ) : (
        <View style={styles.grid}>
          {saved.map(article => (
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
      )}
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
  title: {
    ...text(typography.displaySm, colors.primary, '700'),
    marginBottom: px(32),
  },
  empty: {
    ...text(typography.bodyLg, colors.textMedium),
    maxWidth: px(1300),
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    columnGap: px(48),
    rowGap: CARD_GAP,
  },
});

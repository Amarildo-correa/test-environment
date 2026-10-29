import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { searchArticles } from '../content/search';
import { ArticleCard, CARD_GAP } from '../components/ArticleCard';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Search'>;

// Busca pelos cards, aberta pelo botão Buscar da Home. O parâmetro `query`
// permite abrir a tela já com uma busca feita.
export function SearchScreen({ navigation, route }: Props) {
  const initialQuery = route.params?.query ?? '';
  const [text, setText] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchArticles(query), [query]);

  const submit = useCallback(() => setQuery(text), [text]);
  const openArticle = useCallback(
    (id: string) => navigation.navigate('Detail', { id }),
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        placeholder="Digite o nome de um card"
        placeholderTextColor={colors.divider}
        returnKeyType="search"
        hasTVPreferredFocus={results.length === 0}
        style={styles.input}
        accessibilityLabel="Campo de busca"
      />

      {query !== '' && (
        <Text style={styles.summary}>
          {results.length === 0
            ? `Nenhum card encontrado para “${query}”.`
            : `Resultados para “${query}”`}
        </Text>
      )}

      <View style={styles.grid}>
        {results.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            preferred={index === 0}
            onOpenArticle={openArticle}
          />
        ))}
      </View>
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
    color: colors.orange,
    fontSize: px(72),
    fontWeight: 'bold',
    marginBottom: px(24),
  },
  input: {
    color: colors.white,
    fontSize: px(40),
    borderWidth: px(4),
    borderColor: colors.divider,
    paddingVertical: px(16),
    paddingHorizontal: px(28),
  },
  summary: {
    color: colors.white,
    fontSize: px(36),
    marginTop: px(30),
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    columnGap: px(48),
    rowGap: CARD_GAP,
    marginTop: px(30),
  },
});

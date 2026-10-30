import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeSyntheticEvent } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { searchArticles } from '../content/search';
import { ArticleCard, CARD_GAP } from '../components/ArticleCard';
import {
  colors,
  px,
  safeArea,
  shapes,
  text,
  typography,
} from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Search'>;

// `submitAction` vem do TextInput do Vega; os tipos do react-native não o têm.
type SubmitEvent = NativeSyntheticEvent<{ text: string; submitAction?: string }>;

// Busca pelos cards, aberta pelo botão Buscar da Home. O parâmetro `query`
// permite abrir a tela já com uma busca feita.
export function SearchScreen({ navigation, route }: Props) {
  const initialQuery = route.params?.query ?? '';
  const [text, setText] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [inputFocused, setInputFocused] = useState(false);
  const results = useMemo(() => searchArticles(query), [query]);

  // No Vega OS, o Voltar também dispara onSubmitEditing, com submitAction
  // 'previous': só fecha o teclado, sem buscar.
  const submit = useCallback(
    (e: SubmitEvent) => {
      if (e.nativeEvent.submitAction !== 'previous') {
        setQuery(text);
      }
    },
    [text],
  );
  const handleInputFocus = useCallback(() => setInputFocused(true), []);
  const handleInputBlur = useCallback(() => setInputFocused(false), []);
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
        placeholderTextColor={colors.placeholder}
        returnKeyType="search"
        hasTVPreferredFocus={results.length === 0}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        style={inputFocused ? styles.inputFocused : styles.input}
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

// Campo no padrão do TextInput da Amazon: superfície escura, cantos de 5 e
// borda branca no foco.
const input = {
  ...text(typography.bodyMd),
  backgroundColor: colors.surface,
  borderRadius: px(shapes.inputRadius),
  borderWidth: px(shapes.inputFocusBorder),
  borderColor: 'transparent',
  paddingVertical: px(16),
  paddingHorizontal: px(28),
} as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: safeArea.horizontal,
    paddingVertical: safeArea.vertical,
  },
  title: {
    ...text(typography.displaySm, colors.primary, '700'),
    marginBottom: px(24),
  },
  input,
  // Borda branca mostra que o campo tem o foco; OK abre o teclado.
  inputFocused: { ...input, borderColor: colors.focus },
  summary: {
    ...text(typography.titleMd, colors.textMedium),
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

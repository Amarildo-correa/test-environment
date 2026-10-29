import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { Button } from '../components/Button';
import { getArticle } from '../content/articles';
import { colors, px, safeArea, text, typography } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Detail'>;

// O botão Voltar do controle remoto é tratado pelo stack navigator, que volta
// para a Home; lá, useFocusRestore devolve o foco ao card de origem.
export function DetailScreen({ navigation, route }: Props) {
  const article = getArticle(route.params.id);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.screen}>
      <Button label="‹ Voltar" onPress={goBack} hasTVPreferredFocus />

      {article ? (
        <>
          <Text style={styles.titleAccent}>{article.titleStart}</Text>
          <Text style={styles.title}>{article.titleEnd}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{article.body}</Text>
        </>
      ) : (
        <Text style={styles.body}>Conteúdo não encontrado.</Text>
      )}
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
  titleAccent: {
    ...text(typography.displaySm, colors.primary, '700'),
    marginTop: px(56),
  },
  title: text(typography.displaySm, colors.textHigh, '700'),
  divider: {
    height: px(2),
    backgroundColor: colors.divider,
    marginVertical: px(40),
  },
  body: {
    ...text(typography.bodyLg, colors.textMedium),
    maxWidth: px(1500),
  },
});

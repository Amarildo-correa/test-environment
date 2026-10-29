import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';
import { Focusable } from '../focus';
import { getArticle } from '../content/articles';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Detail'>;

// O botão Voltar do controle remoto é tratado pelo stack navigator, que volta
// para a Home; lá, useFocusRestore devolve o foco ao card de origem.
export function DetailScreen({ navigation, route }: Props) {
  const article = getArticle(route.params.id);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.screen}>
      <Focusable
        hasTVPreferredFocus
        onPress={goBack}
        style={styles.backButton}
        focusedStyle={styles.backButtonFocused}
        accessibilityRole="button"
      >
        {focused => (
          <Text style={focused ? styles.backTextFocused : styles.backText}>
            ‹ Voltar
          </Text>
        )}
      </Focusable>

      {article ? (
        <>
          <Text style={styles.titleOrange}>{article.titleStart}</Text>
          <Text style={styles.titleWhite}>{article.titleEnd}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{article.body}</Text>
        </>
      ) : (
        <Text style={styles.body}>Conteúdo não encontrado.</Text>
      )}
    </View>
  );
}

const title = {
  fontSize: px(96),
  fontWeight: 'bold',
  lineHeight: px(112),
} as const;
const backText = {
  color: colors.black,
  fontSize: px(36),
  fontWeight: 'bold',
} as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: safeArea.horizontal,
    paddingVertical: safeArea.vertical,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingVertical: px(16),
    paddingHorizontal: px(40),
    borderWidth: px(6),
    borderColor: colors.white,
    marginBottom: px(56),
  },
  backButtonFocused: {
    borderColor: colors.orange,
    transform: [{ scale: 1.08 }],
  },
  backText,
  backTextFocused: { ...backText, textDecorationLine: 'underline' },
  titleOrange: { ...title, color: colors.orange },
  titleWhite: { ...title, color: colors.white },
  divider: {
    height: px(2),
    backgroundColor: colors.divider,
    marginVertical: px(40),
  },
  body: {
    color: colors.white,
    fontSize: px(40),
    lineHeight: px(64),
    maxWidth: px(1500),
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Focusable } from '../focus';
import { getArticle } from '../content/articles';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// O botão Voltar do controle remoto é tratado pelo native-stack, que volta
// para a Home; lá, useFocusRestore devolve o foco ao card de origem.
export function DetailScreen({ navigation, route }: Props) {
  const article = getArticle(route.params.id);

  return (
    <View style={styles.screen}>
      <Focusable
        hasTVPreferredFocus
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        focusedStyle={styles.backButtonFocused}
        accessibilityRole="button"
      >
        {focused => (
          <Text style={[styles.backText, focused && styles.backTextFocused]}>
            ‹ Voltar
          </Text>
        )}
      </Focusable>

      {article ? (
        <>
          <Text style={[styles.title, styles.orange]}>{article.titleStart}</Text>
          <Text style={[styles.title, styles.white]}>{article.titleEnd}</Text>
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
  backText: {
    color: colors.black,
    fontSize: px(36),
    fontWeight: 'bold',
  },
  backTextFocused: {
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: px(96),
    fontWeight: 'bold',
    lineHeight: px(112),
  },
  orange: { color: colors.orange },
  white: { color: colors.white },
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

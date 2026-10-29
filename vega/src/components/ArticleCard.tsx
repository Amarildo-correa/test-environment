import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Focusable } from '../focus';
import type { Article } from '../content/articles';
import { colors, px, shapes, text, typography } from '../theme';

type ArticleCardProps = {
  article: Article;
  preferred: boolean;
  onOpenArticle: (id: string) => void;
  // Usados pela Home para devolver o foco ao card ao voltar do detalhe.
  register?: (key: string) => (node: View | null) => void;
  onFocusArticle?: (id: string) => void;
};

// Card memoizado com handlers estáveis (lista anti-padrões do porte para Vega),
// no visual do Card da Amazon: superfície escura, cantos arredondados e borda
// branca no foco.
export const ArticleCard = memo(function ArticleCard({
  article,
  preferred,
  onOpenArticle,
  register,
  onFocusArticle,
}: ArticleCardProps) {
  const ref = useMemo(
    () => register?.(article.id),
    [register, article.id],
  );
  const handleFocus = useCallback(
    () => onFocusArticle?.(article.id),
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

export const CARD_GAP = px(40);

const styles = StyleSheet.create({
  card: {
    width: '31.5%',
    height: '46%',
    backgroundColor: colors.surface,
    borderRadius: px(shapes.cardRadius),
    padding: px(32),
    // A borda existe sempre (transparente) para o foco não deslocar o layout.
    borderWidth: px(shapes.cardFocusBorder),
    borderColor: 'transparent',
  },
  cardFocused: {
    borderColor: colors.focus,
  },
  cardTitle: {
    ...text(typography.titleMd, colors.textHigh, '700'),
    marginBottom: px(12),
  },
  cardBody: text(typography.bodyMd, colors.textMedium),
});

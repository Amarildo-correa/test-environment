import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Focusable, useFocusRestore } from '../focus';
import { articles } from '../content/articles';
import { colors, px, safeArea } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { remember, isPreferred } = useFocusRestore(articles[0].id);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Amazon Fire Stick</Text>
        <Text style={styles.headerOs}>VEGA OS</Text>
      </View>
      <View style={styles.divider} />

      <Text style={styles.title}>
        <Text style={styles.orange}>Hello </Text>
        <Text style={styles.white}>World</Text>
      </Text>

      <View style={styles.grid}>
        {articles.map(article => (
          <Focusable
            key={article.id}
            hasTVPreferredFocus={isPreferred(article.id)}
            onFocus={() => remember(article.id)}
            onPress={() => navigation.navigate('Detail', { id: article.id })}
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
        ))}
      </View>
    </View>
  );
}

const CARD_GAP = px(40);

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
  title: {
    fontSize: px(110),
    fontWeight: 'bold',
    marginTop: px(30),
    marginBottom: px(30),
  },
  orange: { color: colors.orange },
  white: { color: colors.white },
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

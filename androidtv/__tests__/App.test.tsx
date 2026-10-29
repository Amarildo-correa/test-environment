/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import App from '../App';
import { articles } from '../src/content/articles';

// Sem o mock, o SafeAreaProvider não renderiza nada até receber medidas da tela.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

test('Home mostra o título e os 6 cards', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });

  const texts = renderer.root
    .findAllByType(Text)
    .map(node => [].concat(node.props.children).join(''));

  expect(texts).toContain('Amazon Fire Stick');
  expect(texts).toContain('VEGA OS');
  for (const article of articles) {
    expect(texts).toContain(`${article.titleStart} ${article.titleEnd}`);
  }

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});

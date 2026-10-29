import 'react-native';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { App } from '../src/App';
import { articles } from '../src/content/articles';

// Os hooks de splash e TTFD só funcionam no aparelho: no Jest, o
// usePreventHideSplashScreen do react-native-kepler usa `Platform` sem
// importá-lo e quebra ("Platform is not defined").
jest.mock('@amazon-devices/react-native-kepler', () => ({
  ...jest.requireActual('@amazon-devices/react-native-kepler'),
  usePreventHideSplashScreen: jest.fn(),
  useHideSplashScreenCallback: () => jest.fn(),
}));
jest.mock('@amazon-devices/kepler-performance-api', () => ({
  useReportFullyDrawn: () => jest.fn(),
}));

describe('App', () => {
  it('mostra o cabeçalho, o título e os 6 cards da Home', () => {
    const screen = render(<App />);
    expect(screen.getByText('Amazon Fire Stick')).toBeTruthy();
    expect(screen.getByText('VEGA OS')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
    for (const article of articles) {
      expect(
        screen.getByLabelText(`${article.titleStart} ${article.titleEnd}`),
      ).toBeTruthy();
    }
  });
});

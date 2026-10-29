// Correções para mocks de Jest do @amazon-devices/react-native-kepler 4.0.x:
// - o mock de BackHandler exporta o objeto direto, mas o index.js do kepler
//   lê `.default` (fica undefined e o React Navigation quebra ao montar);
// - os mocks de addEventListener não devolvem a assinatura com `remove()`.
// O jest.mock exige a fábrica inline; as duas usam este helper (o prefixo
// `mock` permite referenciá-lo dentro da fábrica).
const mockBackHandler = () => {
  const BackHandler = {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    exitApp: jest.fn(),
  };
  return { __esModule: true, default: BackHandler, ...BackHandler };
};
// O index.js do kepler resolve a variante da plataforma (BackHandler.kepler.js).
jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/BackHandler',
  () => mockBackHandler(),
);
jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/BackHandler.kepler',
  () => mockBackHandler(),
);

jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/Dimensions',
  () => {
    const size = { width: 1920, height: 1080, scale: 1, fontScale: 1 };
    return {
      __esModule: true,
      default: {
        get: () => size,
        set: jest.fn(),
        addEventListener: jest.fn(() => ({ remove: jest.fn() })),
        removeEventListener: jest.fn(),
      },
    };
  },
);

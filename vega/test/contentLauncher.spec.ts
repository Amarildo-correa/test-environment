import { parseContentSearch } from '../src/contentLauncher/parseContentSearch';
import {
  resolveLaunch,
  setPendingLaunch,
  subscribePendingLaunch,
  takePendingLaunch,
} from '../src/contentLauncher/pendingLaunch';

type Param = {
  type: number;
  value: string;
  externalIdList?: { name: string; value: string }[];
};

// Imita o IContentSearch entregue pelo Content Launcher.
function contentSearch(params: Param[]) {
  return {
    getParameterList: () =>
      params.map(p => ({
        getParamType: () => p.type,
        getValue: () => p.value,
        getExternalIdList: () =>
          (p.externalIdList ?? []).map(e => ({
            getName: () => e.name,
            getValue: () => e.value,
          })),
      })),
  };
}

describe('parseContentSearch', () => {
  it('usa a frase do parâmetro VIDEO como pedido', () => {
    const launch = parseContentSearch(
      contentSearch([
        { type: 6, value: 'Comédia' },
        { type: 13, value: 'Desenvolva para experiência na TV' },
      ]),
      false,
    );
    expect(launch).toEqual({
      query: 'Desenvolva para experiência na TV',
      contentId: undefined,
      autoPlay: false,
    });
  });

  it('junta os valores quando não há VIDEO e lê o amzn_id', () => {
    const launch = parseContentSearch(
      contentSearch([
        { type: 0, value: 'controle', externalIdList: [{ name: 'amzn_id', value: '5' }] },
        { type: 6, value: 'remoto' },
      ]),
      true,
    );
    expect(launch).toEqual({ query: 'controle remoto', contentId: '5', autoPlay: true });
  });
});

describe('resolveLaunch', () => {
  it('abre o card do amzn_id quando ele existe', () => {
    expect(resolveLaunch({ query: '', contentId: '4', autoPlay: true })).toEqual({
      screen: 'Detail',
      id: '4',
    });
  });

  it('abre o card que se destaca pelo pedido', () => {
    expect(
      resolveLaunch({
        query: 'Abra o card Desenvolva para Experiência na TV no Hello World',
        autoPlay: false,
      }),
    ).toEqual({ screen: 'Detail', id: '1' });
  });

  it('mostra a busca quando o pedido é ambíguo ou desconhecido', () => {
    expect(resolveLaunch({ query: 'TV', contentId: '99', autoPlay: false })).toEqual({
      screen: 'Search',
      query: 'TV',
    });
  });
});

describe('fila de pedidos pendentes', () => {
  it('avisa quem está ouvindo e entrega o pedido uma vez só', () => {
    const listener = jest.fn();
    const unsubscribe = subscribePendingLaunch(listener);
    setPendingLaunch({ query: 'vega', autoPlay: false });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(takePendingLaunch()).toEqual({ query: 'vega', autoPlay: false });
    expect(takePendingLaunch()).toBeUndefined();
    unsubscribe();
  });
});

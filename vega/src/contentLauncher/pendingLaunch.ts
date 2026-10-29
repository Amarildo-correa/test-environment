import { getArticle } from '../content/articles';
import { findBestArticle } from '../content/search';

// Pedido recebido do Content Launcher (Alexa ou Fire TV).
export type PendingLaunch = {
  // Frase pedida, ex.: "Desenvolva para experiência na TV".
  query: string;
  // `amzn_id` do pedido, quando houver: aqui, o id do card.
  contentId?: string;
  autoPlay: boolean;
};

export type LaunchRoute =
  | { screen: 'Detail'; id: string }
  | { screen: 'Search'; query: string };

// Na partida a frio o pedido chega antes de a navegação estar pronta. Por
// isso o handler só guarda o pedido aqui, e a navegação o consome quando
// estiver montada (padrão "pending launch" da Amazon).
let pending: PendingLaunch | undefined;
const listeners = new Set<() => void>();

export function setPendingLaunch(launch: PendingLaunch) {
  pending = launch;
  listeners.forEach(listener => listener());
}

export function takePendingLaunch(): PendingLaunch | undefined {
  const launch = pending;
  pending = undefined;
  return launch;
}

export function subscribePendingLaunch(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Abre o card direto quando o pedido aponta para um só; senão, mostra a busca.
export function resolveLaunch(launch: PendingLaunch): LaunchRoute {
  if (launch.contentId && getArticle(launch.contentId)) {
    return { screen: 'Detail', id: launch.contentId };
  }
  const best = findBestArticle(launch.query);
  if (best) {
    return { screen: 'Detail', id: best.id };
  }
  return { screen: 'Search', query: launch.query };
}

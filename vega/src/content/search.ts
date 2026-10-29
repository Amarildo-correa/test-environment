import { Article, articles } from './articles';

// Palavras que aparecem nos pedidos ("Alexa, abra o card ... no Hello World")
// mas não ajudam a escolher um card.
const STOPWORDS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'e', 'de', 'da', 'do', 'das', 'dos',
  'em', 'na', 'no', 'nas', 'nos', 'para', 'pra', 'com', 'sobre',
  'abra', 'abre', 'abrir', 'mostre', 'mostra', 'mostrar', 'procure',
  'procura', 'procurar', 'busque', 'busca', 'buscar', 'encontre', 'ache',
  'assista', 'assistir', 'veja', 'ver', 'card', 'cartao', 'artigo', 'tela',
  'alexa', 'hello', 'world', 'app', 'aplicativo',
]);

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function keywords(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(word => word.length > 0 && !STOPWORDS.has(word));
}

// Aceita variações de flexão ("experiência"/"experiencias") pelo prefixo.
function sameWord(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }
  return a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a));
}

type Scored = { article: Article; score: number };

// Palavra do pedido encontrada no título vale 2; só no texto, vale 1.
function score(query: string): Scored[] {
  const wanted = Array.from(new Set(keywords(query)));
  if (wanted.length === 0) {
    return [];
  }
  return articles
    .map(article => {
      const title = keywords(`${article.titleStart} ${article.titleEnd}`);
      const body = keywords(article.body);
      const total = wanted.reduce((sum, word) => {
        if (title.some(t => sameWord(word, t))) {
          return sum + 2;
        }
        return body.some(b => sameWord(word, b)) ? sum + 1 : sum;
      }, 0);
      return { article, score: total };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function searchArticles(query: string): Article[] {
  return score(query).map(item => item.article);
}

// O card pedido, quando um deles se destaca dos outros pelo título.
export function findBestArticle(query: string): Article | undefined {
  const [first, second] = score(query);
  if (!first || first.score < 2) {
    return undefined;
  }
  return second && second.score === first.score ? undefined : first.article;
}

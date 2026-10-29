import { findBestArticle, searchArticles } from '../src/content/search';

describe('busca de cards', () => {
  it('acha o card pelo pedido de voz completo', () => {
    const card = findBestArticle(
      'Abra o card Desenvolva para Experiência na TV no Hello World',
    );
    expect(card?.id).toBe('1');
  });

  it('ignora acentos e maiúsculas', () => {
    expect(findBestArticle('NAVEGACAO ESPACIAL')?.id).toBe('2');
    expect(findBestArticle('área segura')?.id).toBe('4');
  });

  it('aceita variações de palavra pelo prefixo', () => {
    expect(findBestArticle('botões do controle')?.id).toBe('5');
  });

  it('não escolhe quando dois cards empatam', () => {
    // "TV" aparece no título de dois cards.
    expect(findBestArticle('tv')).toBeUndefined();
    expect(searchArticles('tv').map(a => a.id)).toEqual(
      expect.arrayContaining(['1', '6']),
    );
  });

  it('usa o texto do card quando o título não tem a palavra', () => {
    expect(searchArticles('sofá').map(a => a.id)).toEqual(['3']);
    expect(findBestArticle('sofá')).toBeUndefined();
  });

  it('não acha nada para pedidos vazios ou sem relação', () => {
    expect(searchArticles('')).toEqual([]);
    expect(searchArticles('abra o card no hello world')).toEqual([]);
    expect(searchArticles('futebol')).toEqual([]);
  });
});

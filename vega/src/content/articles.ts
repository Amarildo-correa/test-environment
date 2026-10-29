export type Article = {
  id: string;
  // O título é exibido em duas partes: a primeira em laranja, a segunda em branco.
  titleStart: string;
  titleEnd: string;
  body: string;
};

export const articles: Article[] = [
  {
    id: '1',
    titleStart: 'Desenvolva para a',
    titleEnd: 'experiência na TV',
    body: 'O design para Fire TV exige considerações específicas, incluindo elementos relacionados ao hardware e aos serviços. Conheça os princípios de design para TV a fim de integrar seu aplicativo à interface do Fire TV e adaptar seu código a diferentes dispositivos e comportamentos.',
  },
  {
    id: '2',
    titleStart: 'Navegação espacial',
    titleEnd: 'com o D-pad',
    body: 'Na TV não existe toque nem mouse: o usuário se move com as setas do controle remoto. Cada elemento interativo precisa ser alcançável pelas quatro direções, e o caminho do foco deve ser previsível. Organize os itens em linhas e colunas e evite becos sem saída.',
  },
  {
    id: '3',
    titleStart: 'Interface para',
    titleEnd: 'ver a 3 metros',
    body: 'A TV é vista do sofá, a cerca de três metros de distância. Use fontes grandes, alto contraste e poucos elementos por tela. Prefira títulos curtos e descrições objetivas, e deixe sempre claro qual item está selecionado.',
  },
  {
    id: '4',
    titleStart: 'Área segura',
    titleEnd: 'nas bordas da tela',
    body: 'Algumas TVs cortam as bordas da imagem. Mantenha textos e botões a pelo menos 5% de distância de cada borda. Fundos e imagens decorativas podem ir até a borda, mas nada que o usuário precise ler ou selecionar.',
  },
  {
    id: '5',
    titleStart: 'Botões do',
    titleEnd: 'controle remoto',
    body: 'O app deve responder às setas, ao botão central (OK) e ao Voltar. O Voltar sempre leva à tela anterior e nunca fecha o app de surpresa. Botões de mídia, como Play/Pause, devem funcionar sempre que houver vídeo ou áudio tocando.',
  },
  {
    id: '6',
    titleStart: 'Vega OS',
    titleEnd: 'no Fire TV',
    body: 'Vega OS é o sistema da Amazon baseado em Linux para os novos aparelhos Fire TV. Os apps são escritos em React Native for Vega e empacotados em arquivos .vpkg. Boa parte do código React Native existente pode ser reaproveitada, trocando bibliotecas do Android por equivalentes do Vega.',
  },
];

export function getArticle(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

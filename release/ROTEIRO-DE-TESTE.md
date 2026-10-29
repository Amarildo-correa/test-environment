# Roteiro de teste no Fire TV Stick (Vega OS)

Use só o controle remoto. Marque cada item; se algo falhar, anote o número do item e o que apareceu na tela.

## Antes de começar

- [ ] O Fire TV Stick está com **Vega OS 1.2 ou superior** (Configurações > Minha Fire TV > Sobre). O app exige 1.2.
- [ ] O app foi instalado pelo Live App Testing (ver `COMO-ENVIAR.md`) e aparece em "Seus apps".

## 1. Abertura

- [ ] 1.1 Ao abrir, aparece a tela de abertura preta com "Hello World" e depois a Home.
- [ ] 1.2 A Home mostra "Amazon Fire Stick" em laranja à esquerda, "VEGA OS" em branco à direita e uma linha cinza embaixo.
- [ ] 1.3 O título "Hello" (laranja) "World" (branco) aparece grande, na mesma linha.
- [ ] 1.4 A grade tem 6 cartões cinza, em 2 linhas de 3.

## 2. Foco inicial e navegação na grade

- [ ] 2.1 Ao abrir, o **cartão 1** ("Desenvolva para a experiência na TV") já está focado: borda branca grossa e levemente maior.
- [ ] 2.2 Direita, direita: o foco anda para o cartão 2 e depois para o 3.
- [ ] 2.3 Baixo: o foco desce para o cartão 6.
- [ ] 2.4 Esquerda, esquerda: o foco vai para o 5 e depois para o 4.
- [ ] 2.5 Cima: o foco volta para o cartão 1.
- [ ] 2.6 Em nenhum momento o foco some ou fica preso.

## 3. Abrir cada cartão

Para cada cartão: focar, apertar **OK**, conferir a tela e voltar.

| Cartão | Título na tela (laranja / branco) | Abriu certo |
|---|---|---|
| 1 | Desenvolva para a / experiência na TV | [ ] |
| 2 | Navegação espacial / com o D-pad | [ ] |
| 3 | Interface para / ver a 3 metros | [ ] |
| 4 | Área segura / nas bordas da tela | [ ] |
| 5 | Botões do / controle remoto | [ ] |
| 6 | Vega OS / no Fire TV | [ ] |

Em cada tela de detalhe:
- [ ] 3.1 O botão **"‹ Voltar"** (fundo branco, texto preto) está no topo e **já focado** (borda laranja e texto sublinhado).
- [ ] 3.2 Há uma linha cinza abaixo do título e um texto curto em branco, fácil de ler.

## 4. Voltar

- [ ] 4.1 Na tela do cartão 2, aperte **OK** no botão "Voltar": volta para a Home com o **cartão 2 focado**.
- [ ] 4.2 Na tela do cartão 5, aperte o botão **Voltar do controle**: volta para a Home com o **cartão 5 focado**.
- [ ] 4.3 Repita 4.1 e 4.2 com outros cartões: o foco sempre volta ao cartão de onde você saiu.
- [ ] 4.4 Na Home, o botão Voltar do controle sai do app (comportamento normal).

## 5. Legibilidade (a cerca de 3 metros da TV)

- [ ] 5.1 Os títulos dos cartões e o texto das telas de detalhe são legíveis do sofá.
- [ ] 5.2 Nada fica cortado nas bordas da tela (cabeçalho, cartões e o botão Voltar têm margem).
- [ ] 5.3 Fica sempre claro qual item está focado.

## Pontos que só o aparelho confirma

O porte para Vega foi compilado e testado de forma automatizada, mas estes pontos ainda não foram vistos rodando em um aparelho Vega:
- o foco voltar ao cartão de origem (itens 4.1 a 4.3);
- a transição entre telas, que no Vega é a padrão do stack navigator (no Android TV era fade);
- o título "Hello World" em dois textos lado a lado.

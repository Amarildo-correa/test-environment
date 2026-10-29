# Teste do ambiente: app "Hello World TV" (Android TV → Vega OS)

> **Objetivo:** validar se a estratégia **Android TV + App Porting** funciona no meu Windows **antes** de desenvolver o app real (Read on TV).
> **Modo:** planejamento. Faça a pesquisa (Passo 0), me mostre um plano curto e só então execute os 5 passos.

---

## Meu ambiente

- Windows 11 com **Claude Code no WSL Ubuntu**.
- No Windows: Android CLI, Android SDK e **Android Emulator com system image Android TV**.
- Você tem permissão para instalar qualquer ferramenta útil para desenvolvimento e testes.
- **Estratégia escolhida:** sem VM e sem dual boot. O Linux "nativo" só entra via **Docker no WSL** ou **GitHub Actions** para compilar o `.vpkg`.
- O Vega SDK **não suporta Windows/WSL** oficialmente. Se algo depender dele, diga explicitamente.

## Permissões

Você tem todas permissões para acessar qualquer domínio e paineis da minha conta no Chrome via CLI chrome-devtools pelo terminal, com chrome-devtools start --autoConnect, para se conectar ao meu Chrome pessoal (conta amarildo) que já está aberto, inclusive ja está aberto [Developer Amazon](https://developer.amazon.com/apps-and-games/console/app/new.html)

---

## Passo 0: pesquisa antes de executar

- **MCP Context7:** confirme a versão atual e a API de `react-native-tvos` (foco: `hasTVPreferredFocus`, `TVFocusGuideView`, `nextFocus*`), da navegação com suporte a TV e do Vega SDK / React Native for Vega (build de `.vpkg`, Dockerfile de CI, manifest).
- **Pesquisa aprofundada na web** (WebSearch/WebFetch, subagentes se ajudar):
  - Amazon Devices Builder Tools (ADBT) e o fluxo **App Porting** (Fire OS RN → React Native for Vega): quais fases exigem o Vega SDK.
  - Docker no WSL com o Dockerfile oficial de CI do Vega e build de `.vpkg` via GitHub Actions.
  - Ponte WSL ↔ emulador no Windows (`adb.exe` vs `adb` Linux, `adb reverse` para o Metro).
  - Assets obrigatórios da Amazon Appstore para Fire TV/Vega e o fluxo do **Live App Testing**.
- **Entregável:** resumo das descobertas com links + plano curto. Depois disso, siga sem esperar aprovação, a menos que encontre um bloqueio.

---

## Especificação do app

**Nome:** `Hello World TV` · **Package:** `com.helloworldtv.app` (ajuste se necessário)

### Tela 1: Home

- Fundo preto `#000000`.
- Cabeçalho: **"Amazon Fire Stick"** em laranja `#FF6A00` + **"VEGA OS"** em branco, negrito, com uma linha divisória cinza `#555555` abaixo.
- Título grande: **"Hello"** em laranja + **"World"** em branco, negrito.
- Grade **3 × 2** com 6 cards:
  - Fundo cinza `#404040`, texto branco, cantos retos, texto truncado em 3 linhas com "...".
  - **Card focado:** borda branca grossa (~4 px), com um leve aumento de escala.
  - **Foco inicial** no card 1.
- Cada card abre a tela de detalhe correspondente (telas 2 a 7).

### Telas 2 a 7: Detalhe

- Fundo preto.
- Botão **"Voltar"** no topo: fundo branco, texto preto, com estado de foco visível. **Foco inicial** nele.
- Título em duas linhas: primeira parte em laranja, segunda em branco, negrito e grande.
- Linha divisória cinza.
- Texto curto (3 a 5 linhas) em branco, com boa entrelinha.
- O botão **Voltar do controle remoto** também volta para a Home, devolvendo o foco ao card de origem.

### Conteúdo dos 6 cards

| # | Título | Texto |
|---|---|---|
| 1 | Desenvolva para a experiência na TV | O design para Fire TV exige considerações específicas, incluindo elementos relacionados ao hardware e aos serviços. Conheça os princípios de design para TV a fim de integrar seu aplicativo à interface do Fire TV e adaptar seu código a diferentes dispositivos e comportamentos. |
| 2 a 6 | **Você escreve** | **Você escreve** textos curtos sobre desenvolvimento para TV (ex.: spatial navigation, 10-foot UI, área segura, controle remoto, Vega OS) |

### Requisitos de TV

- Navegação **100% por D-pad**: todo elemento interativo alcançável só com as setas + OK + Voltar.
- Margem de área segura de ~5% nas bordas, fontes legíveis a 3 metros, resolução-base de 1920×1080.
- Android manifest: `LEANBACK_LAUNCHER` + `LAUNCHER`, `touchscreen` e `leanback` com `required="false"`, `android:banner` de 320×180.

---

## Os 5 passos

### Passo 1: desenvolver em `react-native-tvos`

- Criar o projeto em TypeScript com `react-native-tvos`, as 7 telas e a navegação.
- Isolar a lógica de foco num módulo próprio (facilita a migração).
- Commits pequenos e descritivos.

### Passo 2: testar no emulador Android TV

- Rodar o emulador **no Windows** e conectar o WSL via `adb` (documente o arranjo que funcionar em `docs/setup.md`).
- Instalar e testar o app: foco inicial, navegação na grade, ida e volta para cada tela, botão Voltar do controle.
- Tirar screenshots de todas as telas (`adb exec-out screencap`) e salvar em `docs/screenshots/android-tv/`.
- Gerar o **APK de release**.

### Passo 3: converter para Vega com o App Porting

- Duplicar o projeto em `vega/` (mantenha o original intacto).
- Instalar o ADBT: `npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context` e `check-status`.
- Rodar o App Porting: *"Convert my Fire OS RN app to a Vega RN App"*.
- Se alguma fase exigir o Vega SDK, tente rodá-la **dentro do container Docker** do Passo 4.
- Resolver as pendências do `NextSteps.md` e me informar **em qual fase o fluxo parou e por quê**.

### Passo 4: compilar o `.vpkg`

Tente nesta ordem:

1. **Docker no WSL** com o Dockerfile oficial de CI do Vega SDK (Ubuntu 22.04).
2. **GitHub Actions** com runner Ubuntu: crie `.github/workflows/vega-build.yml`, publique o `.vpkg` como artefato, acompanhe com `gh run watch` e baixe com `gh run download`.
3. Se os dois falharem: **pare e me reporte** os erros com o diagnóstico. **Não proponha VM.**

### Passo 5: deixar tudo pronto para eu testar no Fire Stick com Vega

Crie a pasta `release/` com:

- `HelloWorldTV.vpkg` (e o APK de release, como bônus).
- **Assets da loja:** ícone 512×512, ícone 114×114, banner/background para Fire TV e screenshots 1920×1080. Confirme na pesquisa os tamanhos exigidos hoje.
- **Política de privacidade:** página simples ("o app não coleta dados pessoais") publicada via GitHub Pages, com a URL anotada.
- **Textos da loja em PT-BR:** nome, descrição curta, descrição longa e categoria.
- `release/COMO-ENVIAR.md`: passo a passo para **eu** enviar o `.vpkg` pelo **Developer Console** usando o **Live App Testing** (criar o app, enviar o VPKG, selecionar os aparelhos Vega, cadastrar meu e-mail como testador).
- `release/ROTEIRO-DE-TESTE.md`: checklist para eu executar no Fire Stick físico (foco inicial, navegação na grade, abrir cada uma das 6 telas, Voltar pelo botão e pelo controle, legibilidade).

---

## Regras

- **Nada irreversível sem perguntar:** publicação, exclusão de arquivos fora do projeto, mudanças globais no Windows.
- O envio para a Amazon e o teste no Fire Stick são **meus**: não tente automatizá-los.
- **Seja honesto sobre limitações:** se algo não funcionar no WSL, diga, em vez de contornar em silêncio.

## Relatório final

Ao terminar, me entregue:

1. ✅/❌ de cada passo, com uma linha de explicação.
2. O caminho do `.vpkg` e dos arquivos em `release/`.
3. **Veredito:** a estratégia Android TV + App Porting funciona no meu Windows? Quais pontos foram frágeis?
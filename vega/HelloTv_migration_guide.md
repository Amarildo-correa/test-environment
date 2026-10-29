# HelloTv — FOS RN to VegaScript Migration Guide

## App Summary
- App name: HelloTv
- Package: com.helloworldtv.app
- RN version (FOS): react-native-tvos 0.83.10-1 (React 19.2.0)
- JS/TSX files analyzed: 10
- Native modules found: 0 (2 arquivos Kotlin são bridges padrão do RN)
- Dependencies with Vega equivalent: 5
- Dependencies needing manual work: 0
- Integrations detected: none

## Template Variables
- `{{packageId}}`: com.helloworldtv.app
- `{{componentId}}`: com.helloworldtv.app.main
- `{{name}}`: com.helloworldtv.app
- `{{nameLowerCase}}`: com.helloworldtv.app

## Integration Detection

Sinais de detecção ("FOS Detection Signals") das 7 visões gerais de integração da KB conferidos contra o inventário, o AndroidManifest.xml, o package.json e o build.gradle de `androidtv/`:

| Integração (overview) | Sinais específicos verificados | Encontrados |
|---|---|---|
| port_tv_app_to_vega_quick_subscribe_overview.md | 15 | 0 |
| port_tv_app_to_vega_media_controls_overview.md | 11 | 0 |
| port_tv_app_to_vega_live_tv_overview.md | 10 | 0 |
| port_tv_app_to_vega_iap_overview.md | 8 | 0 |
| port_tv_app_to_vega_content_personalization_overview.md | 16 | 0 |
| port_tv_app_to_vega_content_launcher_overview.md | 19 | 0 |
| port_tv_app_to_vega_aps_overview.md | 9 | 0 |

- `{detected_integrations}`: **nenhuma**. O app não usa SDKs da Amazon Appstore, ponte nativa nem serviços em segundo plano.
- Sub-tópicos relevantes: nenhum. Dependências entre integrações: nenhuma. Pré-requisitos a adicionar: nenhum.
- Observação: não há `libs/` em `android/app/`, e o `build.gradle` não tem JARs de SDK da Amazon.

## Dependency Analysis

Variante: **B — react-native-tvos direto** (`"react-native": "npm:react-native-tvos@0.83.10-1"`, build por Gradle). Sem Expo.

Versões não são fixadas aqui: a Fase 3 resolve cada pacote `@amazon-devices/*` com `vega project install` e `vega project install --fix` (Coherence Policy §3).

### dependencies

| Pacote FOS | Ação | Observações |
|---|---|---|
| `@react-navigation/native` | replace → `@amazon-devices/react-navigation__native` | **unit_id**: dependency:@react-navigation/native — Pacote Amazon (dois sublinhados). Fonte: react_native_for_vega_navigation.md. |
| `@react-navigation/native-stack` | replace → `@amazon-devices/react-navigation__stack` | **unit_id**: dependency:@react-navigation/native-stack — A KB recomenda `createStackNavigator` (JS) por funcionar com o conjunto mínimo de dependências; o native-stack exige pacotes extras. Ver ajuste de código em navigation.tsx e telas. |
| `react` | copy (versão do template) | **unit_id**: dependency:react — Faz parte do runtime do sistema no Vega; manter a versão que o template `helloWorld` (RN 0.83) declara. |
| `react-native` | replace → `@amazon-devices/react-native-kepler` | **unit_id**: dependency:react-native — `react-native-tvos` é substituído pelo runtime do Vega (supported libraries: "replaces react-native-tvos entirely"). Não empacotar React/React Native. |
| `react-native-safe-area-context` | replace → `@amazon-devices/react-native-safe-area-context` | **unit_id**: dependency:react-native-safe-area-context — Presente na Package Version Matrix (linha RN 0.83). |
| `react-native-screens` | replace → `@amazon-devices/react-native-screens` | **unit_id**: dependency:react-native-screens — Suporte parcial (🚧). Chamar `enableScreens()` e `enableFreeze()` na inicialização. |

### devDependencies

| Pacote FOS | Ação | Observações |
|---|---|---|
| `@babel/core` | copy (versão do template se existir) | **unit_id**: dependency:@babel/core — Ferramenta de desenvolvimento JS, portável. |
| `@babel/preset-env` | copy (versão do template se existir) | **unit_id**: dependency:@babel/preset-env — Ferramenta de desenvolvimento JS, portável. |
| `@babel/runtime` | copy (versão do template se existir) | **unit_id**: dependency:@babel/runtime — Ferramenta de desenvolvimento JS, portável. |
| `@react-native-community/cli` | remove_dependency | **unit_id**: dependency:@react-native-community/cli — Ferramenta da CLI Android/iOS; o Vega usa a Vega CLI e os scripts do template. |
| `@react-native-community/cli-platform-android` | remove_dependency | **unit_id**: dependency:@react-native-community/cli-platform-android — Ferramenta da CLI Android/iOS; o Vega usa a Vega CLI e os scripts do template. |
| `@react-native-community/cli-platform-ios` | remove_dependency | **unit_id**: dependency:@react-native-community/cli-platform-ios — Ferramenta da CLI Android/iOS; o Vega usa a Vega CLI e os scripts do template. |
| `@react-native/babel-preset` | replace → versão do template | **unit_id**: dependency:@react-native/babel-preset — Ferramentas do RN 0.83; usar as versões que o template `helloWorld` declara. |
| `@react-native/eslint-config` | replace → versão do template | **unit_id**: dependency:@react-native/eslint-config — Ferramentas do RN 0.83; usar as versões que o template `helloWorld` declara. |
| `@react-native/metro-config` | replace → versão do template | **unit_id**: dependency:@react-native/metro-config — Ferramentas do RN 0.83; usar as versões que o template `helloWorld` declara. |
| `@react-native/typescript-config` | replace → versão do template | **unit_id**: dependency:@react-native/typescript-config — Ferramentas do RN 0.83; usar as versões que o template `helloWorld` declara. |
| `@types/jest` | copy (versão do template se existir) | **unit_id**: dependency:@types/jest — Ferramenta de desenvolvimento JS, portável. |
| `@types/react` | copy (versão do template se existir) | **unit_id**: dependency:@types/react — Ferramenta de desenvolvimento JS, portável. |
| `@types/react-test-renderer` | copy (versão do template se existir) | **unit_id**: dependency:@types/react-test-renderer — Ferramenta de desenvolvimento JS, portável. |
| `eslint` | copy (versão do template se existir) | **unit_id**: dependency:eslint — Ferramenta de desenvolvimento JS, portável. |
| `jest` | copy (versão do template se existir) | **unit_id**: dependency:jest — Ferramenta de desenvolvimento JS, portável. |
| `prettier` | copy (versão do template se existir) | **unit_id**: dependency:prettier — Ferramenta de desenvolvimento JS, portável. |
| `react-test-renderer` | copy (versão do template se existir) | **unit_id**: dependency:react-test-renderer — Ferramenta de desenvolvimento JS, portável. |
| `typescript` | copy (versão do template se existir) | **unit_id**: dependency:typescript — Ferramenta de desenvolvimento JS, portável. |

Integrações: nenhuma, então nenhum pacote de integração a adicionar.

## Manifest Analysis

Fonte: `androidtv/android/app/src/main/AndroidManifest.xml` e `androidtv/android/app/build.gradle`. KB: `port_tv_app_to_vega_app_manifest_mapping.md`.

| Entrada Android | manifest.toml (Vega) | Ação |
|---|---|---|
| `namespace`/`applicationId "com.helloworldtv.app"` (build.gradle; o manifest não tem `package=`) | `[package] id = "com.helloworldtv.app"` | replace_api_call — mesmo ID para ligar os apps na Appstore |
| `android:label="@string/app_name"` → "Hello World TV" | `[package] title = "Hello World TV"` | replace_api_call |
| `android:icon="@mipmap/ic_launcher"` | `[package] icon = "@image/app_icon.png"` (PNG 512×512 em `assets/image/`) | replace_api_call — gerar com `scripts/make-assets.mjs` |
| `android:banner="@drawable/tv_banner"` | — | N/A: o Vega não usa banner |
| `<activity .MainActivity>` com `MAIN` + `LAUNCHER` + `LEANBACK_LAUNCHER` | `[[components.interactive]]` `id = "com.helloworldtv.app.main"`, `categories = ["com.amazon.category.main"]` | replace_api_call — `runtime-module` vem do scaffold (não fixar aqui) |
| `android:launchMode="singleTask"` | `launch-type = "singleton"` | replace_api_call |
| `<uses-permission android.permission.INTERNET>` | — (não declarar) | O app não faz nenhuma chamada de rede; manter fora evita pedir um serviço que não é usado. Se no futuro usar rede: `[[wants.service]] id = "com.amazon.networking"`. |
| `<uses-feature touchscreen/faketouch/leanback required=false>` | — | N/A no Vega |
| `android:usesCleartextTraffic`, `allowBackup`, `supportsRtl`, `theme` | — | Sem equivalente necessário |
| — | `schema-version = 1` e `[os.version]` | new_in_vega — o scaffold escreve ambos |

Versão (`port_tv_app_to_vega_app_versioning_mapping.md`): `versionName "1.0"`, `versionCode 1` → `[package] version = "1.0.0"`.

Sem `whisperplay.xml` (sem DIAL) e sem intent-filters de deep link. Sem `TextInput` no código, então não precisa do serviço de teclado.

## Source Analysis

### index.js
**unit_id**: file:index.js

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| modify_file | `import App from './App';` | `import { App } from './src/App';` — o template exporta `App` nomeado de `src/App.tsx`; o App do FOS passa a morar em `src/App.tsx` | high |
| parameter_change (app.json) | `"name": "HelloTv"` | `"name": "com.helloworldtv.app.main"` (o nome registrado no `AppRegistry` precisa ser igual ao `id` do componente interativo; o template já gera assim) | high |
| keep | `AppRegistry.registerComponent(appName, () => App)` | igual (manter o `LogBox.ignoreAllLogs()` do template) | high |

Fonte: `index.js` e `app.json` do template `helloWorld`. Sem `NativeModules`.

### App.tsx
**unit_id**: file:App.tsx

Destino: `src/App.tsx` (o template exporta `App` nomeado a partir de `src/App.tsx`).

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| copy_file + modify_file | `function App() {...} export default App;` | `export const App = () => {...}` em `src/App.tsx` | high |
| replace_import | `import { SafeAreaProvider } from 'react-native-safe-area-context';` | `import { SafeAreaProvider } from '@amazon-devices/react-native-safe-area-context';` | high (Package Version Matrix) |
| modify_file | `import { RootNavigator } from './src/navigation';` | `import { RootNavigator } from './navigation';` (caminho relativo dentro de `src/`) | high |
| manual_review | `<StatusBar hidden />` | Remover. A busca na KB por `StatusBar` não retornou nenhum documento; barra de status é um conceito do Android e não existe na tela da TV com Vega. | low |

Sem `NativeModules`.

### src/theme.ts
**unit_id**: file:src/theme.ts

Copy unchanged. Usa `Dimensions.get('window').width` só para escalar o layout desenhado em 1920×1080. A KB (`vega_graphics_api.md`) diz: "React Native's `Dimensions` API works on Vega without changes — only migrate display code if the app queries physical display properties". Confiança: high.

Atenção para a Fase 5 (aparelho): conferir se a largura da janela no Vega é 1920 (escala 1) ou 960 (dp, como no Android TV). Em ambos os casos `px()` escala proporcionalmente.

### src/content/articles.ts
**unit_id**: file:src/content/articles.ts

Copy unchanged. Dados puros em TypeScript (tipo `Article`, array `articles`, `getArticle()`), sem imports nem APIs de plataforma. Confiança: high.

### src/focus/Focusable.tsx
**unit_id**: file:src/focus/Focusable.tsx

KB: `port_tv_app_to_vega_focus_management_mapping.md`.

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| keep (1:1) | `<Pressable focusable onFocus onBlur ...>` de `react-native` | igual: `focusable`, `onFocus` e `onBlur` são "1:1, same prop, same behavior" | high |
| keep (1:1) | repasse de `hasTVPreferredFocus` via `...rest` | igual (1:1), mas no Vega a prop "only works on initial mount" | high |
| keep | `forwardRef<View, FocusableProps>` | igual; a ref é usada por `useFocusRestore` para o `FocusManager.focus` (ver abaixo) | high |

Sem mudança de import: `Pressable`, `View`, `StyleProp` e `ViewStyle` continuam vindo de `react-native`, como no template.

### src/focus/useFocusRestore.ts
**unit_id**: file:src/focus/useFocusRestore.ts

KB: `port_tv_app_to_vega_focus_management_mapping.md` (`hasTVPreferredFocus` "only works on initial mount"; `FocusManager.focus(tag)` "Programmatically set focus; import from `@amazon-devices/react-native-kepler`"; `findNodeHandle` "still from `react-native`") e o exemplo "Focus Management with Navigation" de `react_native_for_vega_navigation.md` (`useFocusEffect` + `findNodeHandle` + `FocusManager.focus`).

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| replace_import | `import { useFocusEffect } from '@react-navigation/native';` | `import { useFocusEffect } from '@amazon-devices/react-navigation__native';` | high |
| replace_api_call | Ao focar a tela: zera `preferredKey` e reaplica no próximo frame para religar `hasTVPreferredFocus` | Ao focar a tela (exceto na montagem inicial): `FocusManager.focus(findNodeHandle(refs.current[lastFocused.current]))`. Na montagem inicial, continua valendo `hasTVPreferredFocus` só no item inicial | medium |
| modify_file (API do hook) | retorna `{ remember, isPreferred }` | retorna `{ remember, isPreferred, register }`; `register(key)` devolve uma ref callback que guarda o componente em `refs.current[key]` | medium |

Imports novos:
```ts
import { findNodeHandle, View } from 'react-native';
import { FocusManager } from '@amazon-devices/react-native-kepler';
import { useFocusEffect } from '@amazon-devices/react-navigation__native';
```

Código novo de referência:
```ts
export function useFocusRestore(initialKey: string) {
  const lastFocused = useRef(initialKey);
  const refs = useRef<Record<string, View | null>>({});
  const mounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!mounted.current) {
        mounted.current = true; // 1ª vez: hasTVPreferredFocus cuida do foco inicial
        return;
      }
      const tag = findNodeHandle(refs.current[lastFocused.current]);
      if (tag != null) FocusManager.focus(tag);
    }, []),
  );

  const remember = useCallback((key: string) => { lastFocused.current = key; }, []);
  const isPreferred = useCallback((key: string) => key === initialKey, [initialKey]);
  const register = useCallback(
    (key: string) => (node: View | null) => { refs.current[key] = node; },
    [],
  );
  return { remember, isPreferred, register };
}
```

Por que medium: a combinação vem do exemplo da KB, mas o momento exato em que `useFocusEffect` dispara em relação à remontagem das views no Vega só pode ser confirmado no aparelho (Fase 5).

### src/focus/index.ts
**unit_id**: file:src/focus/index.ts

Copy unchanged. Só reexporta `Focusable`, `FocusableProps` e `useFocusRestore`. Confiança: high.

### src/navigation.tsx
**unit_id**: file:src/navigation.tsx

KB: `react_native_for_vega_navigation.md` e `vega_supported_libraries_and_services.md` (linha react-navigation recomenda `createStackNavigator`).

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| replace_import | `import { DarkTheme, NavigationContainer } from '@react-navigation/native';` | `import { DarkTheme, NavigationContainer } from '@amazon-devices/react-navigation__native';` | high |
| replace_import + replace_api_call | `import { createNativeStackNavigator } from '@react-navigation/native-stack';` / `createNativeStackNavigator<RootStackParamList>()` | `import { createStackNavigator } from '@amazon-devices/react-navigation__stack';` / `createStackNavigator<RootStackParamList>()` | high |
| add (best practice da KB) | — | `import { enableFreeze, enableScreens } from '@amazon-devices/react-native-screens';` e chamar `enableScreens(); enableFreeze();` no topo do módulo, antes de criar o navigator ("Always call enableScreens() and enableFreeze() at app startup") | high |
| parameter_change | `screenOptions={{ headerShown: false, animation: 'fade' }}` | `screenOptions={{ headerShown: false }}` — `animation: 'fade'` é opção do native-stack; o stack JS usa a transição padrão. Confirmar no aparelho se a transição fica boa na TV. | medium |
| keep | `RootStackParamList`, `theme`, `Stack.Screen` | iguais | high |

O botão Voltar do controle: a KB de navegação diz "Handle back button — Ensure users can always navigate back". O stack navigator trata o Voltar como no Android; validar no aparelho (Fase 5).

### src/screens/HomeScreen.tsx
**unit_id**: file:src/screens/HomeScreen.tsx

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| replace_import | `import type { NativeStackScreenProps } from '@react-navigation/native-stack';` / `NativeStackScreenProps<RootStackParamList, 'Home'>` | `import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';` / `StackScreenProps<RootStackParamList, 'Home'>` (acompanha a troca para `createStackNavigator`) | high |
| modify_file | `const { remember, isPreferred } = useFocusRestore(articles[0].id);` | `const { remember, isPreferred, register } = useFocusRestore(articles[0].id);` e `ref={register(article.id)}` em cada `<Focusable>` do card (necessário para o `FocusManager.focus` devolver o foco ao card de origem) | medium |
| keep (1:1) | `hasTVPreferredFocus={isPreferred(article.id)}`, `onFocus`, `onPress` | iguais (foco inicial no card 1 na montagem) | high |
| modify_file (precaução) | Título com `<Text>` aninhado: `<Text style={title}><Text>Hello </Text><Text>World</Text></Text>` | `<View style={{ flexDirection: 'row' }}>` com dois `<Text>` irmãos com o estilo do título. O `index.js` do template diz: "Temporary workaround for problem with nested text not working currently". Não há documento da KB sobre isso; evitar o aninhamento elimina o risco. | medium |
| keep | Estilos: `flexWrap`, `rowGap`, `alignContent`, porcentagens, `transform: scale`, `numberOfLines`, `ellipsizeMode` | iguais (RN 0.83 com Yoga 3 nos dois lados) | high |

### src/screens/DetailScreen.tsx
**unit_id**: file:src/screens/DetailScreen.tsx

| Ação | Código antigo | Código novo | Confiança |
|---|---|---|---|
| replace_import | `import type { NativeStackScreenProps } from '@react-navigation/native-stack';` / `NativeStackScreenProps<RootStackParamList, 'Detail'>` | `import type { StackScreenProps } from '@amazon-devices/react-navigation__stack';` / `StackScreenProps<RootStackParamList, 'Detail'>` | high |
| keep (1:1) | `<Focusable hasTVPreferredFocus onPress={() => navigation.goBack()}>` | igual. A tela de detalhe é montada de novo a cada navegação, então o "only works on initial mount" da KB não atrapalha: o foco inicial no Voltar continua funcionando | high |
| modify_file (comentário) | "tratado pelo native-stack" | "tratado pelo stack navigator" | high |
| keep | Título em dois `<Text>` irmãos (não aninhados), divisória, corpo | iguais | high |

## Native Module Analysis

### android/app/src/main/java/com/helloworldtv/app/MainApplication.kt
**unit_id**: file:android/app/src/main/java/com/helloworldtv/app/MainApplication.kt

Bridge padrão do React Native (`ReactApplication`, `PackageList` com autolinking, nenhum pacote manual). Skip: a Fase 3 usa o template do Vega no lugar.

### android/app/src/main/java/com/helloworldtv/app/MainActivity.kt
**unit_id**: file:android/app/src/main/java/com/helloworldtv/app/MainActivity.kt

Bridge padrão (`ReactActivity`, componente "HelloTv", sem `onKeyDown`/`onKeyLongPress` nem `DeviceEventEmitter`). Skip: substituído pelo `[[components.interactive]]` do manifest.toml e pelo `AppRegistry` do template.

Nenhum módulo nativo customizado (`ReactContextBaseJavaModule`/`@ReactMethod`) e nenhum `NATIVE_MODULE_FLAG` pendente da Etapa 5.

## Target File Modifications

### manifest.toml
Partir do manifest gerado pelo template (mantém `schema-version`, `[os.version]`, `[needs]` com o módulo do SO e o `runtime-module` do componente). Alterar apenas:
```toml
[package]
title = "Hello World TV"
version = "1.0.0"
id = "com.helloworldtv.app"
icon = "@image/app_icon.png"
```
`[[components.interactive]]`: `id = "com.helloworldtv.app.main"`, `launch-type = "singleton"`, `categories = ["com.amazon.category.main"]` (já vêm assim do template). Sem `[[components.service]]`, `[wants]`, `[[extras]]`, `[[offers.*]]` ou `[[processes.group]]`: nenhuma integração nem serviço em segundo plano. Nenhuma entrada disparada pelo código-fonte (sem `TextInput`, sem rede).

Asset: `assets/image/app_icon.png` (512×512) gerado por `scripts/make-assets.mjs`.

### package.json
- Manter o que o template declara (`@amazon-devices/react-native-kepler`, `react`, `react-native` 0.83.0 e devDependencies).
- Adicionar com `vega project install` (sem versão fixa) e depois `vega project install --fix`: `@amazon-devices/react-navigation__native`, `@amazon-devices/react-navigation__stack`, `@amazon-devices/react-native-screens`, `@amazon-devices/react-native-safe-area-context`.
- Não adicionar: `react-native-tvos`, `@react-navigation/*`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-community/cli-platform-*`.

### Arquivos
- `src/App.tsx` (do `App.tsx` do FOS), `src/navigation.tsx`, `src/theme.ts`, `src/content/articles.ts`, `src/focus/*`, `src/screens/*`: copiar com as mudanças das seções acima.
- Remover do template: `src/components/Tile.tsx`, `src/data/tiles.tsx`, `src/assets/*`, `test/Tile.spec.tsx` (exemplo do helloWorld). Reescrever `test/App.spec.tsx` para o app portado.
- Renomes `.android.*` → `.kepler.*`: nenhum.
- `NativeModules` não resolvidos: nenhum.

## Best Practice Recommendations

Fontes: `react-native-for-vega-performance-best-practices.md`, `react_native_for_vega_development_best_practices.md`, `vega_runtime_privileges_api.md`.

- **Foco (§8 Focus Management Optimization):** "Keep `onFocus` and `onBlur` handlers simple". O `Focusable` só troca um estado booleano e o `remember` só grava uma ref; já está dentro da recomendação.
- **Navegação (§3):** `enableScreens()` e `enableFreeze()` na inicialização (incluído em `src/navigation.tsx`).
- **Listas:** a grade tem 6 itens fixos; `FlatList`/`FlashList` não se aplicam.
- **Imagens/memória:** o app não carrega imagens em tempo de execução.
- **React Compiler (§5):** o RN 0.83 do Vega usa React 19 com o React Compiler; não é preciso memoização manual.
- **Privilégios em tempo de execução:** o app não acessa câmera, microfone, localização nem outros recursos sensíveis; nenhuma declaração necessária.
- **Conteúdo em vídeo / Parental Controls:** não se aplica (sem vídeo).
- **Login / Simple Sign-In:** não se aplica (sem autenticação).

## Migration Buckets

| bucket_id | display_name | member unit_ids (✓ = confirmed, ? = tentative, needs confirmation) |
|---|---|---|
| core | Core | file:index.js ?, file:App.tsx ?, file:src/navigation.tsx ?, file:src/theme.ts ?, file:src/content/articles.ts ?, file:src/focus/Focusable.tsx ?, file:src/focus/useFocusRestore.ts ?, file:src/focus/index.ts ?, file:android/app/src/main/java/com/helloworldtv/app/MainApplication.kt ?, file:android/app/src/main/java/com/helloworldtv/app/MainActivity.kt ?, dependency:@react-navigation/native ✓, dependency:@react-navigation/native-stack ✓, dependency:react ✓, dependency:react-native ✓, dependency:react-native-safe-area-context ✓, dependency:react-native-screens ✓, dependency:@babel/core ✓, dependency:@babel/preset-env ✓, dependency:@babel/runtime ✓, dependency:@react-native-community/cli ✓, dependency:@react-native-community/cli-platform-android ✓, dependency:@react-native-community/cli-platform-ios ✓, dependency:@react-native/babel-preset ✓, dependency:@react-native/eslint-config ✓, dependency:@react-native/metro-config ✓, dependency:@react-native/typescript-config ✓, dependency:@types/jest ✓, dependency:@types/react ✓, dependency:@types/react-test-renderer ✓, dependency:eslint ✓, dependency:jest ✓, dependency:prettier ✓, dependency:react-test-renderer ✓, dependency:typescript ✓ |
| browse | Browse | file:src/screens/HomeScreen.tsx ? (tela inicial com a grade de cards) |
| details | Details | file:src/screens/DetailScreen.tsx ? (tela de um único conteúdo) |

Notas: os arquivos de entrada, navegação, tema e o módulo de foco são o esqueleto do app; o conteúdo e o foco são usados pelas duas telas, por isso ficam no core. Dependências sem integração vão para core por padrão.

### Unclassified
| unit_id | reason |
|---|---|

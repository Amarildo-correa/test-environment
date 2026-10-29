# Ambiente de desenvolvimento: WSL + emulador Android TV no Windows

Arranjo testado em 2026-10-29 (Windows 11, WSL2 Ubuntu 26.04 em rede NAT, Claude Code no WSL).

## Onde fica cada coisa

| Peça | Onde roda | Observação |
|---|---|---|
| Código, Node 22, npm | WSL | Projeto em `~/project/test-environment` |
| JDK 17 e Android SDK (Linux) | WSL, na pasta do usuário | Usados pelo Gradle. Instalados sem `sudo`: JDK Temurin 17 em `~/.local/opt/`, SDK em `~/Android/Sdk` (platform-tools, android-36, build-tools 36, NDK 27.1). Carregar com `source scripts/env.sh`. |
| Emulador Android TV (`tv_36`, Android 16, 1920×1080) | Windows | AVD criado no Android Studio do Windows |
| `adb` que fala com o emulador | Windows (`adb.exe`) | Chamado direto do WSL |
| Vega SDK / Vega CLI | GitHub Actions (Ubuntu 24.04) | Não roda oficialmente no WSL; ver `.github/workflows/vega-*.yml` |

## Ligar o emulador a partir do WSL

```bash
powershell.exe -c 'Start-Process -FilePath "C:\Users\amari\AppData\Local\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd","tv_36","-no-snapshot-save"'
```

## Usar o adb do Windows a partir do WSL

O jeito que funcionou é chamar o `adb.exe` do Windows direto, sem servidor adb no Linux:

```bash
A=/mnt/c/Users/amari/AppData/Local/Android/Sdk/platform-tools/adb.exe
$A devices                 # emulator-5554  device
```

- Caminhos de arquivo passados ao `adb.exe` precisam ser do Windows (`C:\...`). Para instalar um APK gerado no WSL, copie antes para uma pasta do Windows:
  ```bash
  cp androidtv/android/app/build/outputs/apk/release/app-release.apk /mnt/c/Users/amari/AppData/Local/Temp/hello-world-tv.apk
  $A install -r 'C:\Users\amari\AppData\Local\Temp\hello-world-tv.apk'
  ```
- Screenshots com `exec-out` saem íntegras pelo WSL (PNG válido, 1920×1080):
  ```bash
  $A exec-out screencap -p > docs/screenshots/android-tv/01-home.png
  ```
- Teclas do controle remoto: `$A shell input keyevent <código>` — 19 cima, 20 baixo, 21 esquerda, 22 direita, 23 OK, 4 Voltar.
- Não rode o `adb` do Linux (`~/Android/Sdk/platform-tools/adb`) com o emulador ligado: ele tentaria subir outro servidor na porta 5037.

## Compilar o APK no WSL

```bash
source ~/.bashrc && source scripts/env.sh
cd androidtv && npm install
cd android && ./gradlew assembleRelease
```

- O `.npmrc` de `androidtv/` liga `legacy-peer-deps`: o react-native-tvos usa versões como `0.83.10-1`, que o semver trata como pré-lançamento.
- `react-native-screens` fica em `~4.25.2`: a 4.26+ exige react-native 0.84.

## Metro (modo debug) — não usado neste teste

Este teste usou só builds de release (o JavaScript vai dentro do APK). Para o modo debug com Metro rodando no WSL, o caminho documentado é `$A reverse tcp:8081 tcp:8081`: o emulador acessa a porta 8081 do Windows, e na rede NAT do WSL2 o `localhost` do Windows encaminha para o WSL. Não foi testado aqui.

## Problemas encontrados

- **Internet lenta (~100 KB/s):** o download do NDK pelo Gradle travou em 380 MB; ele foi baixado com `curl -C -` (retoma de onde parou) e extraído à mão. Ao extrair com `zipfile` do Python, os links simbólicos viram arquivos de texto; foi preciso recriá-los (35 links, incluindo o `clang`).
- **Vega SDK:** o download do SDK caiu duas vezes dentro do Docker local pela mesma lentidão. Por isso o SDK roda no GitHub Actions.

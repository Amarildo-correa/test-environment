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
- **Vega SDK:** o download (1,23 GB) caiu algumas vezes por quedas da internet; depois que a conexão estabilizou, baixou em ~12 minutos dentro do container. O `.vpkg` de release continua sendo gerado no GitHub Actions (`vega-build.yml`).

## Instalar no Fire Stick físico (modo desenvolvedor) — testado em 2026-10-29

Aparelho: Fire TV Stick HD (2ª geração), Vega OS 2.0, IP 192.168.1.2 (mesma rede do notebook, mesmo com Wi-Fi 5 GHz × 2,4 GHz).

O Vega SDK roda num container Docker persistente (`vega-sdk-dl`, Ubuntu 22.04) com o SDK num volume (`vega-home`):

```bash
docker start vega-sdk-dl                      # se o container estiver parado
V='docker exec vega-sdk-dl bash -c'
$V 'source /root/vega/dbus.env; export PATH=/root/vega/bin:$PATH; vega exec vda connect 192.168.1.2:5555'
docker cp release/HelloWorldTV.vpkg vega-sdk-dl:/root/HelloWorldTV.vpkg
$V 'export PATH=/root/vega/bin:$PATH; vega device install-app --packagePath /root/HelloWorldTV.vpkg && vega device launch-app --appName com.helloworldtv.app.main'
```

Ativação do modo desenvolvedor (uma vez por aparelho):
1. `vega devmode login` usa autorização por código (URL `amazon.com/us/code` + código); aprovar no navegador do Windows. O token vai para o chaveiro do Linux: o container precisa de `dbus-x11`, `gnome-keyring` e de uma sessão dbus com o chaveiro destravado (`/root/vega/dbus.env`). Sem isso a CLI falha com `dbus-launch: executable file not found`.
2. No Fire Stick: Configurações > Minha Fire TV > Sobre > 7× OK no nome do aparelho > Opções do desenvolvedor > Modo desenvolvedor > Continuar → código de 6 caracteres (vale 5 minutos).
3. `vega devmode enable-device --code <código>` → o aparelho reinicia; a porta 5555 abre cerca de 2 minutos depois.

A verificação de identidade pendente na conta Amazon Developer não bloqueou o modo desenvolvedor.

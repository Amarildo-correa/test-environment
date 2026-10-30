# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

"Hello World TV": one small TV app implemented twice, used to validate developing **Vega OS** (Amazon Fire TV) apps from **Windows + WSL2**, where the Vega SDK is not officially supported.

- `androidtv/` — source app, **react-native-tvos 0.83** (Android TV / Fire OS). Builds an APK.
- `vega/` — the same app ported to **React Native for Vega 0.83** (Vega SDK 0.24.x). Builds a `.vpkg`. Ported following the Amazon "Port TV App to Vega" workflow; `vega/HelloTv_migration_guide.md` documents every change and `vega/NextSteps.md` lists open items.
- `docs/` — GitHub Pages site (`index.html` landing page, `privacidade.html` privacy policy), `setup.md` (environment how-to), Android TV screenshots.
- `release/` — store assets, PT-BR store texts, submission and device test guides. `*.apk`/`*.vpkg` are git-ignored.
- `scripts/` — `env.sh` (JDK 17 + Android SDK paths for WSL) and `make-assets.mjs` (banner, icons, store images, Vega icon and splash zip from SVG via `sharp`).

The general procedure (container, developer mode, CI, porting rules, pitfalls) is captured in the user skill **`vega-os-windows`**; load it for any Vega task.

## Commands

### androidtv/ (run in WSL)
```bash
source ~/.bashrc && source scripts/env.sh          # from repo root: JDK 17 + Android SDK
cd androidtv && npm install                        # .npmrc sets legacy-peer-deps
npx tsc --noEmit && npx eslint . && npx jest
npx jest __tests__/App.test.tsx                     # single test file
cd android && ./gradlew assembleRelease             # APK: android/app/build/outputs/apk/release/
```
The Android TV emulator runs on **Windows**; use Windows `adb.exe` from WSL (Windows paths for files):
```bash
A=/mnt/c/Users/amari/AppData/Local/Android/Sdk/platform-tools/adb.exe
$A install -r 'C:\Users\amari\AppData\Local\Temp\hello-world-tv.apk'
$A shell input keyevent 22   # 19 up, 20 down, 21 left, 22 right, 23 OK, 4 back
```

### vega/ (JS checks in WSL; SDK work in Docker or CI)
```bash
cd vega && npm install --legacy-peer-deps
npx tsc --noEmit && npm run lint && npx jest
npx jest test/App.spec.tsx
```
- **Release `.vpkg`**: pushing changes under `vega/` runs `.github/workflows/vega-build.yml` (installs SDK, `vega project install --fix`, `vega project doctor --rn-version 0.83`, lint, tests, `npm run build:release`). Download with `gh run download <id> -n hello-world-tv-vpkg`. The Fire TV Stick uses the **armv7** package.
- **Vega CLI locally**: Docker container `vega-sdk-dl` (SDK in volume `vega-home`), e.g. `docker exec vega-sdk-dl bash -c 'export PATH=/root/vega/bin:$PATH; vega ...'`. `vega devmode` commands need `source /root/vega/dbus.env` first (keyring).
- **Install on the physical Fire Stick** (developer mode already enabled, IP 192.168.1.2):
  `~/.claude/skills/vega-os-windows/scripts/vega-device.sh 192.168.1.2 release/HelloWorldTV.vpkg com.helloworldtv.app`
- **See / drive / debug the TV** (`~/.claude/skills/vega-os-windows/scripts/vega-tv.sh`): `shot /tmp/tv.png` (1920×1080 screenshot to read), `key KEY_RIGHT KEY_ENTER KEY_BACK` (remote buttons), `logs com.helloworldtv.app` / `follow com.helloworldtv.app` (app logs).

### Assets
```bash
cd scripts && npm install && node make-assets.mjs   # regenerates androidtv res/, release/assets/, vega/assets/
```

## Architecture

Both apps share the same structure under `src/`: `theme.ts` (layout drawn in 1920×1080 pixels and scaled by `Dimensions` width, 5% safe area), `content/articles.ts` (the 6 cards; titles split into an orange and a white part), `screens/HomeScreen.tsx` (header + 3×2 card grid) and `screens/DetailScreen.tsx` (focused "Voltar" button, title, body), `navigation.tsx` (Home → Detail stack).

**All D-pad focus logic lives in `src/focus/`** (`Focusable`, `useFocusRestore`) so screens stay platform-neutral. This is where the two apps intentionally differ:
- Android TV: `useFocusRestore` re-toggles `hasTVPreferredFocus` when the Home regains focus.
- Vega: `hasTVPreferredFocus` only works on mount, so the hook keeps refs per card and calls `FocusManager.focus(findNodeHandle(ref))` inside `useFocusEffect`.

Other Vega-specific differences (keep them when editing `vega/`):
- Packages are the Amazon forks (`@amazon-devices/react-navigation__native`, `__stack`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`). Navigation uses `createStackNavigator` (not native-stack) and the app is wrapped in `GestureHandlerRootView`; `enableScreens()`/`enableFreeze()` run in `navigation.tsx`.
- `src/launch.ts` holds the mandatory splash/TTFD hooks; tests mock this module because the hooks break under Jest.
- `test/setup.js` patches broken `react-native-kepler` Jest mocks (BackHandler `.kepler` variant, `Dimensions.addEventListener`); `jest.config.json` maps `react-native` to the kepler package.
- No nested `<Text>` (title is two sibling `Text`s); handlers/styles are memoized because the template has no React Compiler.
- `app.json` name, `AppRegistry` name and the `manifest.toml` interactive component id must all be `com.helloworldtv.app.main`. Don't hand-edit `runtime-module` in `manifest.toml`.
- Do not commit `vega/package-lock.json` (a WSL lock breaks ESLint plugin resolution in CI); after a CI run, copy back the `package.json` that `vega project install --fix` aligned (artifact `vega-resolved-deps`).

`androidtv/` pins `react-native-screens ~4.25` (4.26+ needs RN 0.84) and needs `legacy-peer-deps` because tvOS versions like `0.83.10-1` are semver prereleases.

## Amazon Devices Builder Tools (MCP)

`.adbt-config.json` maps the repo root to `fire_os` and `vega/` to `vega_os`. Before other ADBT MCP calls in a session, call `set_project_context` with that file's contents, then pass `target_platform` (`{"device_os": ["vega_os"]}` for `vega/`) to `search_documentation`/`list_documents`.

**Installation**: the server is the npm package `@amazon-devices/amazon-devices-buildertools-mcp` (formerly `vega-devtools-mcp`; needs Node 18+). It is registered in the committed `.mcp.json` as `amazon-devices-buildertools` and launched via `npx`, so it works in WSL and in cloud sessions without extra setup. Open a new session in the repo and approve the server when Claude Code asks; its tools appear as `mcp__amazon-devices-buildertools__*`.
- Don't run the official `npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest --init-context`: it opens an interactive agent menu (ignores `--agent`) and wants to write its own steering text into `CLAUDE.md`. `--check-status` verifies a setup.
- Perf/crash tools (`analyze_perfetto_traces`, `get_app_hot_functions`, `symbolicate_acr`) need the Vega SDK, which is only in the local Docker container (`vega-sdk-dl`), not in cloud sessions. Documentation tools work anywhere.
- Docs: https://developer.amazon.com/docs/vega/0.24/mcp-server

## Publishing

Remote: `github.com/Amarildo-correa/test-environment` (public). GitHub Pages serves `docs/` at https://amarildo-correa.github.io/test-environment/. Store listing fields must not mention "Vega".

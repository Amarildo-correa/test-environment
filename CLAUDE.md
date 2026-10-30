# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

"Hello World TV": one small TV app implemented twice, used to validate developing **Vega OS** (Amazon Fire TV) apps from **Windows + WSL2**, where the Vega SDK is not officially supported.

- `androidtv/` — source app, **react-native-tvos 0.83** (Android TV / Fire OS). Builds an APK.
- `vega/` — the same app ported to **React Native for Vega 0.83** (Vega SDK 2.0, Vega OS 2.0 minimum). Builds a `.vpkg`. Ported following the Amazon "Port TV App to Vega" workflow; `vega/HelloTv_migration_guide.md` documents every change and `vega/NextSteps.md` lists open items.
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
- **Vega SDK version**: 2.0.13986, pinned in `vega-build.yml` / `vega-scaffold.yml` (`VEGA_SDK_VERSION`) and active in the container. Check for newer ones with `vega sdk list-remote`.
- **Vega CLI locally**: Docker container `vega-sdk-dl` (SDK in volume `vega-home`), e.g. `docker exec vega-sdk-dl bash -c 'export PATH=/root/vega/bin:$PATH; vega ...'`. `vega devmode` commands need `source /root/vega/dbus.env` first (keyring).
- **Local doctor/build in the container** (Node 22 in `/root/vega/node22`; the repo is not mounted, copy the committed tree):
  ```bash
  docker exec vega-sdk-dl bash -c 'rm -rf /root/work && mkdir -p /root/work'
  git archive HEAD vega | docker exec -i vega-sdk-dl tar -x -C /root/work
  docker exec vega-sdk-dl bash -c 'export PATH=/root/vega/node22/bin:/root/vega/bin:$PATH; cd /root/work/vega && npm install --legacy-peer-deps && vega project doctor --rn-version 0.83 && npm run build:release'
  docker cp vega-sdk-dl:/root/work/vega/build/armv7-release/hellotv_armv7.vpkg release/HelloWorldTV.vpkg
  ```
- **Install on the physical Fire Stick** (developer mode already enabled, IP 192.168.1.2):
  `~/.claude/skills/vega-os-windows/scripts/vega-device.sh 192.168.1.2 release/HelloWorldTV.vpkg com.helloworldtv.app`
  Remote keys may still go to the Fire TV launcher afterwards: relaunch on the device with `vlcm launch-app orpheus://com.helloworldtv.app.main` before sending keys.
- **See / drive / debug the TV** (`~/.claude/skills/vega-os-windows/scripts/vega-tv.sh`): `shot /tmp/tv.png` (1920×1080 screenshot to read), `key KEY_RIGHT KEY_ENTER KEY_BACK` (remote buttons), `logs com.helloworldtv.app` / `follow com.helloworldtv.app` (app logs). Works while the TV shows another input. A 0-byte/black shot usually means another app with DRM video (Fire TV launcher, Netflix) is in front: check `vlcm list` on the device.

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
- Jest (SDK 2.0 model): the `@amazon-devices/*` npm packages only ship types (their code is in the device's system bundles), so tests run on stock `react-native` (`preset: "react-native"`). `test/__mocks__/react-native-kepler.js` mocks the Vega APIs the app uses, `jest.config.json` maps each Amazon fork to the same-version upstream library (devDependencies `@react-navigation/*`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`), and `test/setup.js` pins `Dimensions` to 1920×1080. Add new Vega APIs to the mock when the app starts using them.
- No nested `<Text>` (title is two sibling `Text`s); handlers/styles are memoized because the template (also the SDK 2.0 one) has no React Compiler.
- `SearchScreen`: `onSubmitEditing` ignores `submitAction === 'previous'` (Back on the system keyboard, SDK 2.0 behavior); the type is declared locally because the `react-native` types lack `submitAction`.
- `app.json` name, `AppRegistry` name and the `manifest.toml` interactive component id must all be `com.helloworldtv.app.main`. Don't hand-edit `runtime-module` in `manifest.toml`, and don't add `[[needs.module]] /com.amazon.vega.os@IVega_*`: with SDK 2.0 the build generates it from `[os.version]` (min/target 2.0).
- Do not commit `vega/package-lock.json` (a WSL lock breaks ESLint plugin resolution in CI); after a CI run, copy back the `package.json` that `vega project install --fix` aligned (artifact `vega-resolved-deps`).

`androidtv/` pins `react-native-screens ~4.25` (4.26+ needs RN 0.84) and needs `legacy-peer-deps` because tvOS versions like `0.83.10-1` are semver prereleases.

## Amazon Devices Builder Tools (MCP)

`.adbt-config.json` maps the repo root to `fire_os` and `vega/` to `vega_os`. Before other ADBT MCP calls in a session, call `set_project_context` with that file's contents, then pass `target_platform` (`{"device_os": ["vega_os"]}` for `vega/`) to `search_documentation`/`list_documents`.

## Publishing

Remote: `github.com/Amarildo-correa/test-environment` (public). GitHub Pages serves `docs/` at https://amarildo-correa.github.io/test-environment/. Store listing fields must not mention "Vega".

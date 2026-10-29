# Ambiente de build Android no WSL. Uso: source scripts/env.sh
export JAVA_HOME="$HOME/.local/opt/jdk-17.0.21+9"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

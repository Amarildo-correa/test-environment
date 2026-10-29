# Imagem de build do Vega SDK.
# Base: Dockerfile oficial de CI da Amazon (Vega SDK 0.24):
# https://developer.amazon.com/docs/vega/0.24/continuous-integration.html
# Diferença: Node 22 oficial no lugar do nodejs do apt, porque o
# React Native for Vega 0.83 exige Node >= 22.14.
FROM --platform=linux/amd64 ubuntu:22.04
SHELL ["/bin/bash", "-c"]
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y curl tar xz-utils jq ca-certificates git lz4 build-essential --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ARG NODE_VERSION=22.23.4
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
      | tar -xJ -C /usr/local --strip-components=1 && \
    node -v && npm -v

ENV NONINTERACTIVE=true
ARG SKIP_VVD_INSTALL=true
ENV SKIP_VVD_INSTALL=${SKIP_VVD_INSTALL}

# Camada 1: só a Vega CLI (pequena, fica em cache).
RUN SKIP_SDK_INSTALL=true bash -c "curl -fsSL https://sdk-installer.vega.labcollab.net/get_vvm.sh | bash"
ENV PATH="/root/vega/bin:${PATH}"
RUN vega -v

# Camada 2: o SDK, em separado e com novas tentativas, porque o download é
# grande e a conexão com o servidor da Amazon pode cair no meio.
# O Dockerfile oficial cita 0.24.9311, que não está mais disponível
# (`vega sdk list-remote` em 2026-10-29 lista 0.24.12112 como a mais nova).
ARG VEGA_SDK_VERSION=0.24.12112
ENV VEGA_SDK_VERSION=${VEGA_SDK_VERSION}
RUN for attempt in 1 2 3 4 5; do \
      vega sdk install "${VEGA_SDK_VERSION}" && break; \
      echo "Tentativa ${attempt} falhou; tentando de novo em 15 s"; sleep 15; \
      [ "${attempt}" = 5 ] && exit 1; \
    done && \
    vega sdk use "${VEGA_SDK_VERSION}" && vega sdk list-installed

WORKDIR /work
ENTRYPOINT [ "/bin/bash", "-c" ]

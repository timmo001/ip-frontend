ARG BUILD_FROM=ghcr.io/timmo001/container-base/amd64:stable
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Copy root filesystem
COPY rootfs /

# Copy application
COPY . /opt/app

# Set shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

ARG BUILD_ARCH=amd64

# Install system
# hadolint ignore=DL3003,DL3018
RUN \
    set -o pipefail \
    \
    && apk add --no-cache --virtual .runtime-dependencies \
        nodejs-current=16.6.0-r0 \
        yarn=1.22.10-r0 \
    \
    && cd /opt/app \
    && yarn install --pure-lockfile

# hadolint ignore=DL3003,DL3018
RUN \
    set -o pipefail \
    \
    && cd /opt/app \
    && yarn build \
    \
    && rm -fr /opt/app/.editorconfig \
    && rm -fr /opt/app/.eslintrc.js \
    && rm -fr /opt/app/.git \
    && rm -fr /opt/app/.github \
    && rm -fr /opt/app/.gitignore \
    && rm -fr /opt/app/.mdl.rb \
    && rm -fr /opt/app/.mdlrc \
    && rm -fr /opt/app/.yamllint.yml \
    && rm -fr /opt/app/build.json \
    && rm -fr /opt/app/Dockerfile \
    && rm -fr /opt/app/LICENSE \
    && rm -fr /opt/app/mlc_config.json \
    && rm -fr /opt/app/nfpm.yaml \
    && rm -fr /opt/app/README.md \
    && rm -fr /opt/app/rootfs \
    && rm -fr /opt/app/tsconfig.build.json \
    && rm -fr /opt/app/tsconfig.json \
    && rm -fr /tmp/*

# Build arguments
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

# Labels
LABEL \
    maintainer="Aidan Timson <contact@timmo.xyz>" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="Timmo" \
    org.opencontainers.image.authors="Aidan Timson <contact@timmo.xyz>" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://timmo.dev" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}

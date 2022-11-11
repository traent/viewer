# Wasm libraries

FROM --platform=linux/x86_64 mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet-builder
RUN apt-get update && \
    apt-get install --no-install-recommends -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    dotnet workload install wasm-tools

# WASM
COPY ledger-dotnet /ledger-dotnet

WORKDIR /viewer/frontend

COPY viewer/frontend/build-wasm-libraries.sh ./
RUN mkdir -p ./projects/viewer-app/src/assets/wasm-parser
RUN sh build-wasm-libraries.sh

FROM --platform=${BUILDPLATFORM:-linux} node:16 as node-builder

#
# Sentry release and source maps
#

# Install sentry-cli
# RUN curl -sL https://sentry.io/get-cli/ | bash
ARG SENTRY_CLI_VERSION=1.71.0
RUN wget https://github.com/getsentry/sentry-cli/releases/download/${SENTRY_CLI_VERSION}/sentry-cli-Linux-x86_64 -O /usr/bin/sentry-cli
RUN chmod +x /usr/bin/sentry-cli

# App dependencies
WORKDIR /apps
ENV NODE_OPTIONS=--max_old_space_size=4096
ARG CONFIGURATION
ARG NPM_AUTH_TOKEN

COPY apps/package.json apps/package-lock.json apps/.npmrc ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm ci

## opal
COPY ./apps/projects/opal ./projects/opal
WORKDIR /apps/projects/opal
RUN npm ci
RUN npm run build

## opal-material
WORKDIR /apps
COPY ./apps/projects/traent-design-system ./projects/traent-design-system
COPY ./apps/projects/opal-material ./projects/opal-material

# The actual Viewer

WORKDIR /viewer/frontend

COPY viewer/frontend/projects ./projects
COPY viewer/frontend/package.json viewer/frontend/package-lock.json viewer/frontend/.npmrc ./
COPY viewer/frontend/angular.json apps/tsconfig.json ./
COPY viewer/frontend/git-version.json ./
RUN npm ci

COPY --from=dotnet-builder \
  /viewer/frontend/projects/viewer-app/src/assets/wasm-parser \
  ./projects/viewer-app/src/assets/wasm-parser

RUN npm run build -- --project=viewer-app --configuration=${CONFIGURATION}

# Release to sentry using sentry-cli if sentry enviroment vars are set
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV SENTRY_ORG=$SENTRY_ORG
ENV SENTRY_PROJECT=viewer
COPY viewer/frontend/sentry-release.sh ./
RUN ./sentry-release.sh

#
# Runtime env
#
FROM nginx
ARG NGINX_TEMPLATE=default.conf.template
COPY viewer/nginx/${NGINX_TEMPLATE} /etc/nginx/templates/
COPY --from=node-builder /viewer/frontend/dist /usr/share/nginx/app

# Wasm libraries

FROM --platform=linux/x86_64 mcr.microsoft.com/dotnet/sdk:7.0 AS dotnet-builder
RUN apt-get update && \
    apt-get install --no-install-recommends -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    dotnet workload install wasm-tools

# WASM
COPY ledger-dotnet /ledger-dotnet

WORKDIR /ledger-dotnet/Ledger.Wasm.Container

RUN --mount=type=cache,sharing=locked,target=/root/.nuget/packages \
  dotnet publish -c Release -o /publish

FROM alpine AS wasm-parser

COPY --from=dotnet-builder \
  /publish/wwwroot/_framework \
  wasm-parser

FROM --platform=${BUILDPLATFORM:-linux} node:16 as node-builder

#
# Sentry release and source maps
#

# Install sentry-cli
# RUN curl -sL https://sentry.io/get-cli/ | bash
ARG SENTRY_CLI_VERSION=1.71.0
RUN wget https://github.com/getsentry/sentry-cli/releases/download/${SENTRY_CLI_VERSION}/sentry-cli-Linux-x86_64 -O /usr/bin/sentry-cli
RUN chmod +x /usr/bin/sentry-cli


# The actual Viewer
WORKDIR /viewer/frontend

ENV NODE_OPTIONS=--max_old_space_size=4096
ARG CONFIGURATION
ARG NPM_AUTH_TOKEN

COPY viewer/frontend/package.json viewer/frontend/package-lock.json viewer/frontend/.npmrc ./
COPY viewer/frontend/angular.json apps/tsconfig.json ./
COPY viewer/frontend/git-version.json ./
RUN npm ci

COPY --from=wasm-parser \
  /wasm-parser \
  ./projects/viewer-app/src/assets/wasm-parser

COPY viewer/frontend/projects ./projects
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

#!/bin/bash

# This script create a release and upload source maps to Sentry using sentry-cli
# NOTE: Before to run the script, install sentry-cli with `curl -sL https://sentry.io/get-cli/ | bash`
set -e

if [ -z "${SENTRY_ORG}" ]
then
    echo "SENTRY_ORG env not found!"
    exit 0
fi

if [ -z "${SENTRY_AUTH_TOKEN}" ]
then
    echo "SENTRY_AUTH_TOKEN env not found!"
    exit 0
fi

if [ -z "${SENTRY_PROJECT}" ]
then
    echo "SENTRY_PROJECT env not found!"
    exit 0
fi

if ! [ -f "VERSION" ]
then
    echo "VERSION file not found!"
    exit 0
fi

VERSION=$(cat VERSION)
if [ -z "VERSION" ]
then
    exit 0
fi

echo "Sentry release: ${SENTRY_PROJECT}@${VERSION} (${SENTRY_ORG})]"
sentry-cli --log-level=debug releases new ${SENTRY_PROJECT}@${VERSION}
sentry-cli --log-level=debug releases files ${SENTRY_PROJECT}@${VERSION} upload-sourcemaps ./dist/${SENTRY_PROJECT}
sentry-cli --log-level=debug releases finalize ${SENTRY_PROJECT}@${VERSION}

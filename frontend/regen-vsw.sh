#!/bin/bash
set -e

docker build ../../view-service-worker
IMAGE=$(docker build -q ../../view-service-worker)
CONTAINER=$(docker create $IMAGE)

docker cp $CONTAINER:/dist/sw.mjs projects/viewer-app/src/sw.js
docker rm -f $CONTAINER

echo "Service worker built and copied in assets folder."

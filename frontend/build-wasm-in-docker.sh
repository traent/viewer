#!/bin/bash
set -e

docker build --target wasm-parser -f ../Dockerfile ../..
IMAGE=$(docker build -q --target wasm-parser -f ../Dockerfile ../..)
CONTAINER=$(docker create $IMAGE)

rm -rf projects/viewer-app/src/assets/wasm-parser
docker cp $CONTAINER:/wasm-parser projects/viewer-app/src/assets/wasm-parser
docker rm -f $CONTAINER

echo "Libraries built and copied in assets folder."

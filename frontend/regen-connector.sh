#!/bin/bash
set -e
set -x

INPUT=../../backend/Traent.Backend.TraentNode/viewer.yaml
DIR_PATH="${IDENTITY_DIR:-identity-viewer-api}"
OUTPUT=$PROJECT_PATH$DIR_PATH

echo "Regenerating $OUTPUT from Viewer specification $INPUT" 1>&2
rm -rf "$OUTPUT"
npx -y ng-openapi-gen@0.20 --input $INPUT --output $OUTPUT --ignoreUnusedModels=false

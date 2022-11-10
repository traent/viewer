#!/bin/bash
set -e
set -x

INPUT=../../backend/Traent.Backend.OrgNode/ledgerObjects.yaml
DIR_PATH="${LEDGER_OBJECT_DIR:-ledger-objects}"
OUTPUT=$PROJECT_PATH$DIR_PATH

echo "Regenerating $OUTPUT from ledger objects specification $INPUT" 1>&2
rm -rf "$OUTPUT"
npx -y ng-openapi-gen@0.20 --input $INPUT --output $OUTPUT --ignoreUnusedModels=false

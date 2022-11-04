#!/bin/bash
set -e

LEDGER_LIBRARIES_PATH="../../ledger-dotnet/Ledger.Wasm.Container/"

echo "Building WASM libraries..."
dotnet publish -c Release $LEDGER_LIBRARIES_PATH
rm -Rf projects/viewer-app/src/assets/wasm-parser
cp -R $LEDGER_LIBRARIES_PATH/bin/Release/net6.0/publish/wwwroot/_framework projects/viewer-app/src/assets/wasm-parser

echo "Libraries built and copied in assets folder."

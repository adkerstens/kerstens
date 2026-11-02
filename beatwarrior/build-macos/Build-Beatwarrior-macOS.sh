#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != Darwin ]]; then
  echo 'Build this installer on macOS with Xcode Command Line Tools.' >&2
  exit 1
fi
export RBXPORT_TEST=1
export APPLE_SIGNING_IDENTITY="${APPLE_SIGNING_IDENTITY:--}"
rustup target add aarch64-apple-darwin x86_64-apple-darwin
pnpm install --frozen-lockfile
pnpm exec tauri build --config src-tauri/tauri.mixpilot.conf.json --config src-tauri/tauri.macos.conf.json --target universal-apple-darwin --bundles app,dmg

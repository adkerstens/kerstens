#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != Darwin ]]; then
  echo 'Build this installer on macOS with Xcode Command Line Tools.' >&2
  exit 1
fi
export RBXPORT_TEST=1
export APPLE_SIGNING_IDENTITY="${APPLE_SIGNING_IDENTITY:--}"
export CARGO_PROFILE_RELEASE_LTO=thin
# Apple's entitlement parser is stricter than general-purpose XML parsers.
# Canonical plist XML removes Windows newlines and XML comments before signing.
python3 - <<'PY'
from pathlib import Path
import plistlib
path = Path('src-tauri/entitlements.plist')
path.write_bytes(plistlib.dumps(plistlib.loads(path.read_bytes()), fmt=plistlib.FMT_XML))
PY
plutil -lint src-tauri/entitlements.plist
signing_probe=$(mktemp "${TMPDIR:-/tmp}/beatwarrior-signing.XXXXXX")
cp /usr/bin/true "$signing_probe"
codesign --force --sign "$APPLE_SIGNING_IDENTITY" --entitlements src-tauri/entitlements.plist "$signing_probe"
codesign --verify --strict "$signing_probe"
rm "$signing_probe"
rustup target add aarch64-apple-darwin x86_64-apple-darwin
pnpm install --frozen-lockfile
pnpm exec tauri build --config src-tauri/tauri.mixpilot.conf.json --config src-tauri/tauri.macos.conf.json --target universal-apple-darwin --bundles app,dmg

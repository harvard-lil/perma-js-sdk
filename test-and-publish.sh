#!/usr/bin/env bash
set -euo pipefail

npm test
npm run test-live
npm run docgen
npm version patch --no-git-tag-version
npm publish --access public

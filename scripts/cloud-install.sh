#!/usr/bin/env bash
set -euo pipefail
node --check src/greet.js
node --check test/greet.test.js

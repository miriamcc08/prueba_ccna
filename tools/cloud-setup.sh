#!/usr/bin/env bash
set -euo pipefail
# Keep the legacy tracked node_modules and SQLite database intact.
export CCNA_SOURCE_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
export CCNA_RUNTIME_ROOT="${CCNA_RUNTIME_ROOT:-/workspace/.ccna-runtime}"
export npm_config_cache="${npm_config_cache:-/workspace/.ccna-cache/npm}"
python3 - <<'PY'
import os, pathlib, shutil
src = pathlib.Path(os.environ['CCNA_SOURCE_ROOT']).resolve()
dst = pathlib.Path(os.environ['CCNA_RUNTIME_ROOT']).resolve()
if dst == src or src in dst.parents:
    raise SystemExit('The execution copy must be outside the source checkout.')
shutil.copytree(src, dst, dirs_exist_ok=True, ignore=shutil.ignore_patterns(
    '.git', 'node_modules', '.env', 'dist', '*.tsbuildinfo', '*.db', '*.db-journal', '*.db-wal', '*.db-shm'))
PY
cd "$CCNA_RUNTIME_ROOT"
npm ci --no-audit --no-fund
npm --prefix server ci --no-audit --no-fund
npm --prefix client ci --no-audit --no-fund
export DATABASE_URL="file:$CCNA_RUNTIME_ROOT/server/prisma/cloud.db"
cd server
./node_modules/.bin/prisma generate
touch prisma/cloud.db
./node_modules/.bin/prisma migrate deploy
npm run db:seed
for batch_file in prisma/questions/original_*.json; do
  python3 ../tools/check-question-calculations.py "$batch_file" --output /tmp/ccna-original-calculations.json
done
npm run db:load-original -- --all
python3 ../tools/review-legacy-calculations.py --output /tmp/ccna-legacy-calculations.json
cd ..
npm run build
npm test

npm run test:browser

#!/usr/bin/env sh
# Mobile Lighthouse on key pages against the production build.
# Usage: npm run build && npx vite preview --port 4173   (in another terminal), then: sh scripts/lighthouse.sh
# Needs a Chromium-based browser: set CHROME_PATH if it is not on the default path.
BASE="${1:-http://localhost:4173}"
OUT="${LH_OUT:-.lighthouse}"
mkdir -p "$OUT"
for page in "home:/" "shop:/shop" "product:/product/pearl-whisper-earrings"; do
  name="${page%%:*}"; path="${page#*:}"
  npx --yes lighthouse@12 "$BASE$path" --quiet --output=json --output-path="$OUT/$name.json" \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new --no-sandbox" >/dev/null 2>&1
  node -e "const r=require(require('path').resolve('$OUT/$name.json')).categories;console.log('$name'.padEnd(9),Object.entries(r).map(([k,v])=>k.slice(0,4)+' '+Math.round(v.score*100)).join('  '))"
done

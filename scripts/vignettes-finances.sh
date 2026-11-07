#!/bin/bash
# Vignettes YouTube d'« Enseignements sur les finances » : out/vignettes/finances-chNN.jpg, 1280 × 720.
#   bash scripts/vignettes-finances.sh [N …]   (sans argument : chapitres 1 à 25)
cd "$(dirname "$0")/.." || exit 1
CHAPITRES=("$@"); [ ${#CHAPITRES[@]} -eq 0 ] && CHAPITRES=($(seq 1 25))
mkdir -p out/vignettes
BUNDLE=$(mktemp -d "${TMPDIR:-/tmp}/finances-bundle-XXXX"); trap 'rm -rf "$BUNDLE"' EXIT
npx remotion bundle src/index.ts --out-dir="$BUNDLE" --log=error || exit 1
for n in "${CHAPITRES[@]}"; do
  nn=$(printf %02d "$n"); png="out/vignettes/finances-ch$nn.png"; jpg="out/vignettes/finances-ch$nn.jpg"
  npx remotion still "$BUNDLE" "VignetteFinancesCh$nn" "$png" --log=error \
    && sips -z 720 1280 -s format jpeg -s formatOptions 92 "$png" --out "$jpg" >/dev/null && rm "$png" \
    && echo "ch$nn : $(du -h "$jpg" | cut -f1)" || echo "ch$nn : ÉCHEC"
done

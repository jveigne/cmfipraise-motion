#!/bin/bash
# Rendu des chapitres d'« Enseignements sur les finances », un par un, depuis un seul bundle.
#   bash scripts/rendre-finances.sh [N …]   (sans argument : chapitres 2 à 25, en sautant ceux déjà rendus)
# Mêmes réglages d'encodage que le chapitre 1. Un chapitre donné en argument est toujours rendu à nouveau.
cd "$(dirname "$0")/.." || exit 1
FORCE=1; CHAPITRES=("$@")
if [ ${#CHAPITRES[@]} -eq 0 ]; then FORCE=0; CHAPITRES=($(seq 2 25)); fi
BUNDLE=$(mktemp -d "${TMPDIR:-/tmp}/finances-bundle-XXXX")
trap 'rm -rf "$BUNDLE"' EXIT
npx remotion bundle src/index.ts --out-dir="$BUNDLE" --log=error || exit 1
ECHECS=()
for n in "${CHAPITRES[@]}"; do
  nn=$(printf %02d "$n"); sortie="out/finances-ch$nn-fr.mp4"
  if [ "$FORCE" = 0 ] && [ -s "$sortie" ]; then echo "ch$nn : déjà rendu"; continue; fi
  libre=$(df -g . | tail -1 | awk '{print $4}')
  if [ "$libre" -lt 2 ]; then echo "ARRÊT : moins de 2 Go libres avant ch$nn"; ECHECS+=("$nn"); break; fi
  debut=$(date +%s)
  if npx remotion render "$BUNDLE" "FinancesCh${nn}FR" "$sortie.tmp.mp4" --log=error; then
    mv "$sortie.tmp.mp4" "$sortie"
    echo "ch$nn : OK en $(( $(date +%s) - debut )) s, $(du -h "$sortie" | cut -f1), $(npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "$sortie" 2>/dev/null) s"
  else
    rm -f "$sortie.tmp.mp4"; echo "ch$nn : ÉCHEC"; ECHECS+=("$nn")
  fi
done
[ ${#ECHECS[@]} -eq 0 ] && echo "TERMINÉ : tous les rendus sont faits" || { echo "TERMINÉ avec échecs : ${ECHECS[*]}"; exit 1; }

#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Regenerating crepe-bretonne recipe image (sweet crepe) ==="
uv run python generate_images.py --recipe-id crepe-bretonne --prompt "sweet Breton crepe folded in quarters, lightly golden, dusted with sugar"

echo ""
echo "=== Regenerating galette-bretonne recipe image (salty crepe) ==="
uv run python generate_images.py --recipe-id galette-bretonne --prompt "Galette de Sarrasin, savory Breton buckwheat galette folded square, filled with ham, egg, and melted cheese"

echo ""
echo "=== Generating Buckwheat Flour ingredient image ==="
uv run python generate_images.py --ingredients --ingredient-name "Buckwheat Flour"

echo ""
echo "=== Generating Ham ingredient image ==="
uv run python generate_images.py --ingredients --ingredient-name "Ham"

echo ""
echo "All crepe & galette images generated!"

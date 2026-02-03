# Recipe Image Generator

Generate photorealistic food images for recipes using Stable Diffusion XL.

## Features

- Uses **RealVisXL V4.0** (SDXL-based) for high-quality photorealistic generation
- Enhanced with **epiCPhoto-XL LoRA** for professional photography quality
- Reads recipes directly from `src/data/recipes.json`
- Automatically builds prompts from recipe name and visible ingredients
- Optimized for Mac (MPS), CUDA, and CPU

## Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager
- ~10GB disk space for models (downloaded on first run)

## Usage

All commands should be run from the `img_generator` directory:

```bash
cd img_generator
```

### List available recipes

```bash
uv run python generate_images.py --list
```

### Preview generated prompts

See what prompts will be used without generating images:

```bash
uv run python generate_images.py --show-prompts
```

### Generate all images

```bash
uv run python generate_images.py
```

### Generate a specific recipe image

```bash
uv run python generate_images.py --recipe-id spaghetti-bolognese
```

### Custom seed for reproducibility

```bash
uv run python generate_images.py --seed 123
```

### Generate ingredient images

List all unique ingredients:

```bash
uv run python generate_images.py --list-ingredients
```

Generate all ingredient images:

```bash
uv run python generate_images.py --ingredients
```

Generate a specific ingredient image:

```bash
uv run python generate_images.py --ingredient-name "Mandarin Oranges"
```

Preview ingredient prompts:

```bash
uv run python generate_images.py --ingredients --show-prompts
```

## How Prompts Are Generated

The script automatically builds prompts from recipe data:

1. Takes the recipe name (e.g., "Spaghetti Bolognese")
2. Extracts visible ingredients from categories: produce, meat, dairy
3. Excludes common invisible ingredients (salt, oil, etc.)
4. Limits to 6 key ingredients for focused composition

Example generated prompt:
```
Spaghetti Bolognese featuring Ground Beef, Onion, Garlic, Parmesan Cheese
```

This is then enhanced with photography keywords for the final prompt:
```
RAW photo, photorealistic, Spaghetti Bolognese featuring Ground Beef, Onion,
Garlic, Parmesan Cheese, professional food photography, soft natural lighting,
shallow depth of field, gourmet plating, appetizing presentation,
high-end restaurant quality, DSLR, 8k uhd, film grain, Fujifilm XT3
```

## Output

Images are saved to `public/images/recipes/` as 500x500 PNG files, named by recipe ID.

## Models Used

- **Base Model**: [RealVisXL V4.0](https://huggingface.co/SG161222/RealVisXL_V4.0) - SDXL-based photorealistic model
- **LoRA**: [epiCPhoto-XL](https://huggingface.co/AiWise/epiCPhoto-XL-LoRA-Derp2) - Photography enhancement

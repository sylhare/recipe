#!/usr/bin/env python3
"""
Recipe Image Generator using RealVisXL V4.0 + epiCPhoto LoRA

Generates 500x500 photorealistic food images for recipes using Hugging Face Diffusers.
Uses RealVisXL V4.0 (SDXL-based) with epiCPhoto-XL-LoRA for professional
food photography quality.
Reads recipe data directly from recipes.json and generates prompts from ingredients.
Optimized for Mac with MPS (Metal Performance Shaders) support.

Usage:
    python generate_images.py              # Generate all images
    python generate_images.py --recipe-id spaghetti-bolognese  # Generate specific image
    python generate_images.py --list       # List available recipes
"""

import argparse
import json
import sys
from pathlib import Path

import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
from PIL import Image


BASE_MODEL_ID = "SG161222/RealVisXL_V4.0"
"""RealVisXL V4.0 base model for photorealistic SDXL generation."""

LORA_MODEL_ID = "AiWise/epiCPhoto-XL-LoRA-Derp2"
"""epiCPhoto-XL LoRA for enhanced photorealistic quality."""

LORA_WEIGHT = 0.7
"""LoRA weight for blending with base model."""

OUTPUT_SIZE = (500, 500)
"""Final output image dimensions in pixels."""

GENERATION_SIZE = (1024, 1024)
"""Native SDXL generation size before resizing."""

NUM_INFERENCE_STEPS = 30
"""Number of denoising steps for image generation."""

GUIDANCE_SCALE = 7.5
"""Classifier-free guidance scale for prompt adherence."""

SEED = 42
"""Default seed for reproducible generation."""

NEGATIVE_PROMPT = (
    "artificial looking, oversaturated, cartoon, plastic looking, blurry, "
    "low quality, dark shadows, overexposed, underexposed, grainy, noise, "
    "bad anatomy, deformed, ugly, mutated, watermark, text, logo, "
    "face asymmetry, eyes asymmetry, deformed eyes"
)
"""Negative prompt terms to avoid common image generation artifacts."""

VISIBLE_INGREDIENTS_CATEGORIES = {"produce", "meat", "dairy"}
"""Ingredient categories that are visible in the final dish."""

EXCLUDED_INGREDIENTS = {
    "salt", "black pepper", "olive oil", "vegetable oil", "canola oil",
    "butter", "sugar", "flour", "water", "stock", "broth"
}
"""Common ingredients that don't need to be prominently featured."""


def get_device() -> str:
    """Determine the best available device for inference."""
    if torch.backends.mps.is_available():
        print("Using MPS (Metal Performance Shaders) for Mac GPU acceleration")
        return "mps"
    elif torch.cuda.is_available():
        print("Using CUDA for GPU acceleration")
        return "cuda"
    else:
        print("Using CPU (this will be slower)")
        return "cpu"


def load_pipeline(device: str) -> StableDiffusionXLPipeline:
    """Load the RealVisXL pipeline with epiCPhoto LoRA."""
    print(f"Loading base model: {BASE_MODEL_ID}")

    dtype = torch.float32 if device == "mps" else torch.float16

    pipeline = StableDiffusionXLPipeline.from_pretrained(
        BASE_MODEL_ID,
        torch_dtype=dtype,
        use_safetensors=True,
        variant="fp16" if dtype == torch.float16 else None,
    )

    pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
        pipeline.scheduler.config,
        use_karras_sigmas=True,
    )

    print(f"Loading LoRA: {LORA_MODEL_ID}")
    pipeline.load_lora_weights(LORA_MODEL_ID)
    pipeline.fuse_lora(lora_scale=LORA_WEIGHT)

    pipeline = pipeline.to(device)

    if device == "mps":
        pipeline.enable_attention_slicing()
    elif device == "cuda":
        pipeline.enable_attention_slicing()
        try:
            pipeline.enable_xformers_memory_efficient_attention()
        except Exception:
            pass

    return pipeline


def build_prompt_from_recipe(recipe: dict) -> str:
    """Build an image generation prompt from recipe data."""
    name = recipe["name"]
    ingredients = recipe.get("ingredients", [])

    visible_ingredients = []
    for ing in ingredients:
        ing_name = ing["name"].lower()
        category = ing.get("category", "").lower()

        if ing_name in EXCLUDED_INGREDIENTS:
            continue

        if category in VISIBLE_INGREDIENTS_CATEGORIES:
            visible_ingredients.append(ing["name"])

    if len(visible_ingredients) > 6:
        visible_ingredients = visible_ingredients[:6]

    ingredients_text = ", ".join(visible_ingredients) if visible_ingredients else ""

    if ingredients_text:
        prompt = f"{name} featuring {ingredients_text}"
    else:
        prompt = name

    return prompt


def generate_image(
    pipeline: StableDiffusionXLPipeline,
    prompt: str,
    device: str,
    seed: int = SEED,
) -> Image.Image:
    """Generate a single food image from a prompt."""
    if device == "mps":
        generator = torch.Generator()
    else:
        generator = torch.Generator(device=device)
    generator.manual_seed(seed)

    enhanced_prompt = (
        f"RAW photo, photorealistic, {prompt}, "
        "professional food photography, soft natural lighting, "
        "shallow depth of field, gourmet plating, appetizing presentation, "
        "high-end restaurant quality, DSLR, 8k uhd, film grain, Fujifilm XT3"
    )

    result = pipeline(
        prompt=enhanced_prompt,
        negative_prompt=NEGATIVE_PROMPT,
        num_inference_steps=NUM_INFERENCE_STEPS,
        guidance_scale=GUIDANCE_SCALE,
        width=GENERATION_SIZE[0],
        height=GENERATION_SIZE[1],
        generator=generator,
    )

    image = result.images[0]

    if image.size != OUTPUT_SIZE:
        image = image.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)

    return image


def load_recipes(recipes_file: Path) -> list[dict]:
    """Load recipes from JSON file."""
    with open(recipes_file) as f:
        data = json.load(f)
    return data


def save_image(image: Image.Image, output_path: Path) -> None:
    """Save image to file, creating parent directories if needed."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, "PNG")
    print(f"Saved: {output_path}")


def main() -> None:
    """Entry point for the recipe image generator CLI."""
    parser = argparse.ArgumentParser(
        description="Generate recipe images using SDXL with epiCPhoto LoRA"
    )
    parser.add_argument(
        "--recipe-id",
        type=str,
        help="Generate image for a specific recipe ID only",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List available recipe IDs",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="../public/images/recipes",
        help="Output directory for generated images",
    )
    parser.add_argument(
        "--recipes-file",
        type=str,
        default="../src/data/recipes.json",
        help="Path to recipes.json file",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=SEED,
        help="Random seed for reproducibility",
    )
    parser.add_argument(
        "--show-prompts",
        action="store_true",
        help="Show generated prompts without generating images",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    recipes_file = script_dir / args.recipes_file
    output_dir = script_dir / args.output_dir

    if not recipes_file.exists():
        print(f"Error: Recipes file not found: {recipes_file}")
        sys.exit(1)

    recipes = load_recipes(recipes_file)

    if args.list:
        print("Available recipe IDs:")
        for recipe in recipes:
            print(f"  - {recipe['id']}")
        return

    if args.recipe_id:
        recipes = [r for r in recipes if r["id"] == args.recipe_id]
        if not recipes:
            print(f"Error: Recipe ID '{args.recipe_id}' not found")
            sys.exit(1)

    if args.show_prompts:
        print("Generated prompts:")
        for recipe in recipes:
            prompt = build_prompt_from_recipe(recipe)
            print(f"\n{recipe['id']}:")
            print(f"  {prompt}")
        return

    device = get_device()
    pipeline = load_pipeline(device)

    print(f"\nGenerating {len(recipes)} image(s)...")
    for i, recipe in enumerate(recipes, 1):
        recipe_id = recipe["id"]
        prompt = build_prompt_from_recipe(recipe)
        output_path = output_dir / f"{recipe_id}.png"

        print(f"\n[{i}/{len(recipes)}] Generating: {recipe_id}")
        print(f"Prompt: {prompt}")

        try:
            image = generate_image(pipeline, prompt, device, args.seed)
            save_image(image, output_path)
        except Exception as e:
            print(f"Error generating {recipe_id}: {e}")
            continue

    print("\nDone!")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Recipe Image Generator using Realistic Vision + Food Photography LoRA

Generates 500x500 food images for recipes using Hugging Face Diffusers.
Uses Realistic Vision V2.0 with michecosta/food_mic LoRA for professional
food photography quality.
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
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from PIL import Image


BASE_MODEL_ID = "SG161222/Realistic_Vision_V2.0"
"""Realistic Vision V2.0 base model for photorealistic generation."""

LORA_MODEL_ID = "michecosta/food_mic"
"""Food photography LoRA for enhanced food image quality."""

OUTPUT_SIZE = (500, 500)
"""Final output image dimensions in pixels."""

GENERATION_SIZE = (512, 512)
"""Native generation size before resizing."""

NUM_INFERENCE_STEPS = 30
"""Number of denoising steps for image generation."""

GUIDANCE_SCALE = 7.5
"""Classifier-free guidance scale for prompt adherence."""

SEED = 42
"""Default seed for reproducible generation."""

NEGATIVE_PROMPT = (
    "artificial looking, oversaturated, cartoon, plastic looking, blurry, "
    "low quality, dark shadows, overexposed, underexposed, grainy, "
    "bad anatomy, deformed, ugly, mutated"
)
"""Negative prompt terms to avoid common image generation artifacts."""


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


def load_pipeline(device: str) -> StableDiffusionPipeline:
    """Load the Realistic Vision pipeline with Food Photography LoRA."""
    print(f"Loading base model: {BASE_MODEL_ID}")

    dtype = torch.float32 if device != "cuda" else torch.float16

    pipeline = StableDiffusionPipeline.from_pretrained(
        BASE_MODEL_ID,
        torch_dtype=dtype,
        safety_checker=None,
        requires_safety_checker=False,
    )

    pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
        pipeline.scheduler.config,
        use_karras_sigmas=True,
    )

    print(f"Loading LoRA: {LORA_MODEL_ID}")
    pipeline.load_lora_weights(LORA_MODEL_ID)

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


def generate_image(
    pipeline: StableDiffusionPipeline,
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
        f"(RAW photo, photorealistic:1.2), {prompt}, "
        "professional food photography, soft natural lighting, "
        "shallow depth of field, gourmet plating, 8k uhd, high detail"
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


def load_prompts(prompts_file: Path) -> list[dict]:
    """Load recipe prompts from JSON file."""
    with open(prompts_file) as f:
        data = json.load(f)
    return data["recipes"]


def save_image(image: Image.Image, output_path: Path) -> None:
    """Save image to file, creating parent directories if needed."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, "PNG")
    print(f"Saved: {output_path}")


def main() -> None:
    """Entry point for the recipe image generator CLI."""
    parser = argparse.ArgumentParser(
        description="Generate recipe images using Stable Diffusion with Food Photography LoRA"
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
        "--seed",
        type=int,
        default=SEED,
        help="Random seed for reproducibility",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    prompts_file = script_dir / "prompts.json"
    output_dir = script_dir / args.output_dir

    if not prompts_file.exists():
        print(f"Error: Prompts file not found: {prompts_file}")
        sys.exit(1)

    recipes = load_prompts(prompts_file)

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

    device = get_device()
    pipeline = load_pipeline(device)

    print(f"\nGenerating {len(recipes)} image(s)...")
    for recipe in recipes:
        recipe_id = recipe["id"]
        prompt = recipe["prompt"]
        output_path = output_dir / f"{recipe_id}.png"

        print(f"\nGenerating: {recipe_id}")
        print(f"Prompt: {prompt[:80]}...")

        try:
            image = generate_image(pipeline, prompt, device, args.seed)
            save_image(image, output_path)
        except Exception as e:
            print(f"Error generating {recipe_id}: {e}")
            continue

    print("\nDone!")


if __name__ == "__main__":
    main()

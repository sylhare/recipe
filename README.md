# Recipe App

A React-based recipe application with AI-generated food photography.

## Prerequisites

- **Node.js** (v18 or later)
- **Python 3.10+** (for image generation only)

## Frontend

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
# Unit tests
npm test

# Unit tests (single run)
npm test -- --run

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Linting

```bash
npm run lint
```

## Image Generator

The `img_generator/` directory contains a Python script for generating recipe images using Stable Diffusion with a food photography LoRA.

### Setup

```bash
cd img_generator
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install torch diffusers transformers accelerate pillow
```

### Usage

```bash
# Generate all recipe images
python generate_images.py

# Generate a specific recipe image
python generate_images.py --recipe-id spaghetti-bolognese

# List available recipes
python generate_images.py --list

# Custom output directory
python generate_images.py --output-dir ./output

# Custom seed for reproducibility
python generate_images.py --seed 123
```

## Project Structure

```
recipe/
├── src/                  # React frontend source
├── public/               # Static assets
├── img_generator/        # Python image generation
├── e2e/                  # Playwright E2E tests
└── .github/workflows/    # CI/CD pipelines
```

# Contributing to Recipe App

## Section 1 — Technical Setup

### Prerequisites

- **Node.js** v18 or later
- **Python 3.10+** (for image generation only)

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Testing

```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run)
npm test -- --run

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

#### Testing Guidelines

- **Always use `toEqual` instead of `toBe`** for assertions. `toBe` uses `Object.is` (strict reference equality), which can produce misleading failures for values that are logically equal. `toEqual` performs deep equality and works correctly for primitives, objects, and arrays.
- **No inline `//` comments in test or e2e files.** Test intent should be expressed through descriptive test names and assertion messages, not prose comments interspersed with code.

### Linting

```bash
npm run lint
```

### Image Generation

The `img_generator/` directory contains a Python script for generating recipe images using Stable Diffusion.

```bash
cd img_generator
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install torch diffusers transformers accelerate pillow

# Generate image for a specific recipe
python generate_images.py --recipe-id your-recipe-id

# Generate all images
python generate_images.py

# List available recipes
python generate_images.py --list
```

## Section 2 — Recipe Template & Pattern

Every recipe in `src/data/recipes.json` follows this structure:

```json
{
  "id": "kebab-case-unique-id",
  "name": "Display Name",
  "description": "One-line description of the dish.",
  "imageUrl": "/images/recipes/kebab-case-unique-id.png",
  "defaultServings": 4,
  "ingredients": [
    {
      "id": "kebab-case-unique-id-1",
      "name": "Ingredient Name",
      "quantity": 200,
      "unit": "g",
      "category": "produce"
    }
  ],
  "instructions": {
    "preparation": ["..."],
    "cooking": ["..."],
    "serving": ["..."],
    "tips": ["tip 1", "tip 2", "tip 3", "tip 4"]
  }
}
```

### Ingredients

- **`id`**: recipe `id` prefix + hyphen + sequential number (e.g., `pasta-bolognese-1`)
- **`name`**: display name, title-cased (e.g., `"Cherry Tomatoes"`)
- **`quantity`**: numeric value for `defaultServings`
- **`unit`**: one of `g`, `kg`, `ml`, `cup`, `tbsp`, `tsp`, `piece`, `pinch`
- **`category`**: one of `produce`, `meat`, `dairy`, `pantry`, `spices`
- Ingredient entries describe **what to buy**, not how to prepare it

### `preparation` section

Steps performed **without any heat source**:

- Cutting, dicing, slicing, mincing, grating, chopping, measuring
- Marinating, room-temperature resting, patting dry
- Setting up equipment (breading stations, laying out bowls)
- Making cold sauces, dressings, salsas, and marinades

**Never** include steps that require a stovetop, oven, grill, or fryer.

Reference ingredients by **capitalized name** (e.g., `"the Onion"`, `"the Ground Beef"`) — the UI uses these for quantity scaling.

### `cooking` section

All steps involve heat (stovetop, oven, grill, fryer, broiler).

Rules:

1. **Stovetop steps must specify heat level**: "over high heat", "over medium-high heat", "over medium heat", "over medium-low heat", or "over low heat"
2. **Every step must include time or a completion condition**: e.g., `"3-4 minutes"` or `"until golden brown and fragrant"`
3. **Oven steps must specify temperature**: use `°F (°C)` format, e.g., `"400°F (200°C)"`
4. **Steps must be in logical order**:
   - Parallel background tasks first (e.g., start rice, boil water, preheat oven)
   - Then protein and aromatics
   - Sauce and finish last
5. **Never include no-heat preparation tasks here**

### `serving` section

Plating, garnishing, and assembly steps. No heat applied. Minimum 3 steps.

### `tips` section

**Always exactly 4 tips**, covering:

1. A technique insight specific to this dish
2. An ingredient substitution or sourcing note
3. A storage or make-ahead tip
4. A flavor variation or upgrade suggestion

## Section 3 — Adding a New Recipe

1. **Choose a unique `id`** in kebab-case (e.g., `"lamb-ragu"`)

2. **Add your recipe JSON** to `src/data/recipes.json` following the template above. Ensure:
   - All ingredients use valid `unit` and `category` values
   - `preparation` contains only no-heat steps
   - `cooking` steps all specify heat level (stovetop) or temperature (oven) and include time or completion condition
   - `tips` has exactly 4 entries

3. **Generate an image**:
   ```bash
   cd img_generator
   python generate_images.py --recipe-id your-recipe-id
   ```
   The image will be saved to `public/images/recipes/your-recipe-id.png`.

4. **Verify the recipe appears correctly**:
   ```bash
   npm run dev
   ```
   Browse to your recipe and check that the preparation, cooking, and serving sections render as expected.

5. **Run all quality checks**:
   ```bash
   npm test -- --run
   npm run test:e2e
   npm run lint
   ```

All checks must pass before opening a pull request.

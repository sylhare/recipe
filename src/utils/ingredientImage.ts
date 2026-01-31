/**
 * Get the URL for an ingredient image.
 * @param ingredientName - The name of the ingredient (e.g., "Chicken Breast")
 * @returns The URL path to the ingredient image
 */
export function getIngredientImageUrl(ingredientName: string): string {
  const id = ingredientName.toLowerCase().replace(/\s+/g, '-')
  return `${import.meta.env.BASE_URL}images/ingredients/${id}.png`
}

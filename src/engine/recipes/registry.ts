import { Recipe } from '../contracts/Recipe';
export { Recipe, type RecipeConfig, type TunnelConfig } from '../contracts/Recipe';

class RecipeRegistry {
  private recipes = new Map<string, Recipe>();

  register(recipe: Recipe): void {
    if (this.recipes.has(recipe.id)) {
      throw new Error(`Recipe with id ${recipe.id} already registered`);
    }
    this.recipes.set(recipe.id, recipe);
  }

  get(id: string): Recipe | undefined {
    return this.recipes.get(id);
  }

  getAll(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getByIds(ids: string[]): Recipe[] {
    return ids.map(id => this.recipes.get(id)).filter((r): r is Recipe => r !== undefined);
  }
}

export const recipeRegistry = new RecipeRegistry();
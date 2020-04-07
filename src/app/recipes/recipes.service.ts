import {Recipe} from "./recipes.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  constructor (private shoppingListService: ShoppingListService) {}
  /*
  private recipes: Recipe[] = [
    new Recipe("Omlet", "Classical omlet!",
      "https://petekonline.com/wp-content/uploads/2018/12/OMLET-e1545228467422.jpg",
      [new Ingredient('Eggs', 2), new Ingredient('Salt', 1), new Ingredient('Pepper', 1)]),
    new Recipe("Toast", "Simple toast!",
      "https://www.simplyrecipes.com/wp-content/uploads/2010/01/cinnamon-toast-horiz-a-1800.jpg",
      [new Ingredient('White bread', 6), new Ingredient('Butter', 1)])
  ];
  */
  recipes: Recipe[] = [];

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipes(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.getRecipes());
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getRecipes());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes());
  }
}

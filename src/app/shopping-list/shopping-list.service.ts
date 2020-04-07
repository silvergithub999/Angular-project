import {Ingredient} from "../shared/ingredient.model";
import {Subject} from 'rxjs';

export class ShoppingListService {
  updateShoppingList = new Subject();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 10),
    new Ingredient("Tomatoes", 8)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.updateShoppingList.next();
  }

  addIngredients (ingredientsToAdd: Ingredient[]) {
    for(let ingredient of ingredientsToAdd) {
      this.ingredients.push(ingredient);
    }
    this.updateShoppingList.next();
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.updateShoppingList.next();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.updateShoppingList.next();
  }


}

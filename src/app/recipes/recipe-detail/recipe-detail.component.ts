import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipes.model';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../../recipes/store/recipes.actions';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => +params.id),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => index === this.id);
        })).subscribe(recipe => {
          this.recipe = recipe;
        });
  }

  sendToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

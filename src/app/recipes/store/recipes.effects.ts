import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipes.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as appState from '../../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class RecipesEffects {
  constructor(private actions: Actions,
              private http: HttpClient,
              private store: Store<appState.AppState>) {
  }

  @Effect()
  fetchRecipes = this.actions.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://project-angular-8e48c.firebaseio.com/recipes.json',
      );
    }),
    map((recipes: Recipe[]) => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://project-angular-8e48c.firebaseio.com/recipes.json',
        recipesState.recipes
      );
    })
  );
}

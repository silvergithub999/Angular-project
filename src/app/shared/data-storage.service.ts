import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Recipe} from '../recipes/recipes.model';
import {RecipeService} from '../recipes/recipes.service';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor (private http: HttpClient,
               private recipesService: RecipeService,
               private authService: AuthService) {}

  storeRecipes() {
    /*
    The interceptor made in 20.16 means we don't have to make
    a similar code like in fetchRecipes comment.
     */
    const recipes = this.recipesService.getRecipes();
    this.http.put(
      'https://project-angular-8e48c.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      // console.log(response);
    });
  }

  fetchRecipes() {
    /*
      This is now replaced with Interceptor of AuthInterceptorService

      return this.authService.user.pipe(
        take(1),
        exhaustMap(user => {
          return this.http.get<Recipe[]>(
            'https://project-angular-8e48c.firebaseio.com/recipes.json',
            {
              params: new HttpParams().set('auth', user.token)
            }
          )
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipesService.setRecipes(recipes);
        })
      );

    */

    return this.http.get<Recipe[]>(
      'https://project-angular-8e48c.firebaseio.com/recipes.json',
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      }));
  }
}

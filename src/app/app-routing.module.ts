import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'}
  // The path above is lazy-loading.
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {preloadingStrategy: PreloadAllModules})], // Optional optimization for lazy-loading, course 16.
  // Instead of loading when needed, loads at first chance.
  exports: [RouterModule]
})
export class AppRoutingModule { }

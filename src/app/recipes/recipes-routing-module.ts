import { Routes } from '@angular/router';
import { Recipes } from './recipes';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeStart } from './recipe-start/recipe-start';
import { RecipeEdit } from './recipe-edit/recipe-edit';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipesResolverService } from './recipes-resolver.service';

export const recipesRoutes: Routes = [
  { 
    path: '',
    component: Recipes, 
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: RecipeStart },
      { path: 'new', component: RecipeEdit },
      { path: ':id', component: RecipeDetail, resolve: [RecipesResolverService] },
      { path: ':id/edit', component: RecipeEdit, resolve: [RecipesResolverService] },
    ]
  },
];
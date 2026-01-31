import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from '../../environments/environment';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(`${environment.firebaseUrl}/recipes.json`, recipes).subscribe(response => {
      console.log(response);
    })
  }
  fetchRecipes() {
    return this.http.get<Recipe[]>(`${environment.firebaseUrl}/recipes.json`).pipe(
      map(recipes => {
        return recipes.map(recipes => {
          return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []};
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }
    ));
  }
}

import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from "./recipe.action";
import { map, switchMap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { environment } from "../../../environments/environment";
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private store: Store<fromApp.AppState> = inject(Store);

    fetchRecipes = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(`${environment.firebaseUrl}/recipes.json`)
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                })
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        )
    );

    storeRecipes = createEffect(() => 
        this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES), 
            withLatestFrom(this.store.select('recipes')), 
            switchMap(([actionData, recipesState]) => {
                return this.http.put(`${environment.firebaseUrl}/recipes.json`, recipesState.recipes)
            })
        ),
        { dispatch: false }
    );
}
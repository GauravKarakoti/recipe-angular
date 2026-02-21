import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Dropdown } from "../../shared/dropdown";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';
import * as RecipesActions from '../store/recipe.action';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  imports: [Dropdown, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  recipe!: Recipe;
  id!: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit() {
    this.route.params.pipe(map(params => {
      return +params['id'];
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }), map(recipesState => {
      return recipesState.recipes.find((recipe, index) => {
        return index === this.id;
      })
    })).subscribe(recipe => {
      this.recipe = recipe!;
    })
  }
  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }
  onEditRecipeComponent() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(["../", this.id, "edit"], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

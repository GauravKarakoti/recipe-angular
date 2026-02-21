import { Component, OnDestroy } from '@angular/core';
import { RecipeItem } from "./recipe-item/recipe-item";
import { Recipe } from '../recipe.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeItem, CommonModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList implements OnDestroy {
  recipes!: Recipe[];
  subscription!: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
  }
  ngOnInit() {
    this.subscription = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
  }
  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

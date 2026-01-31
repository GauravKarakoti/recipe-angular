import { Component } from '@angular/core';
import { RecipeList } from "./recipe-list/recipe-list";
import { CommonModule } from '@angular/common';
import { RecipeService } from './recipe.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipes',
  imports: [RecipeList, CommonModule, RouterOutlet],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  
}

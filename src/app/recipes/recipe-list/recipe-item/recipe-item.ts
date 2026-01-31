import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-recipe-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './recipe-item.html',
  styleUrl: './recipe-item.css',
})
export class RecipeItem {
  @Input() recipe!: Recipe;
  @Input() index!: number;
}

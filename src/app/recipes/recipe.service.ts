import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    recipeSelected = new Subject<Recipe>();
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         "Tasty Schmitzel",
    //         "A super-tasty Schmitzel - just awesome!",
    //         "https://imgs.search.brave.com/A1tstDewjs36SuIqf0e2XxfEuSus-uMjS4mvsGtNkhQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWxscmVjaXBlcy5j/b20vdGhtYi9SNmVM/WWRCdWlTNDh6V1Rs/VFRqRlZ6RS1ZcW89/LzE1MDB4MC9maWx0/ZXJzOm5vX3Vwc2Nh/bGUoKTptYXhfYnl0/ZXMoMTUwMDAwKTpz/dHJpcF9pY2MoKS8z/OTg0NzJfV2llbmVy/LVNjaG5pdHplbF9Q/aG90by1ieS1pc2xh/bmRhcnRpc3QtcmVz/aXplZC00NTE1NzA3/Y2RjZGM0MjFmYTIx/ZGJhMjMzODQzN2I3/ZC5qcGc",
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20),
    //         ]
    //     ),
    //     new Recipe(
    //         "Big Fat Burger",
    //         "What else you need to say?",
    //         "https://imgs.search.brave.com/yObfw1xvryaEPv9k43NG4Fk48p7BgMUialXV0bixEWM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/cnlFUFl6QXBYMjFi/S0JVbWNseFlXMXFQ/WU95cjN0dGEzNk1E/RVpDY3VfNXVqX3RJ/RlVHVGJBbFJWemZz/bmx6M2lXRjBaU3JU/enhZSTdZcWNnTENo/RFVuMk1pZkFmTURx/S0JoOFZwZ2JuU0N5/SHpjcTZLeEhlQ2tl/Nm5DX1RtbFM1UVQ2/cDdGN0NkeHMvdzQw/MC1oMjY2L1NraWxs/ZXQrQnVyZ2VyK29u/K2ErQnVuK1dNLmpw/Zw",
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 1),
    //         ]
    //     ),
    // ];
    private recipes: Recipe[] = [];
    constructor(private slService: ShoppingListService) {}
    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
    getRecipes() {
        return this.recipes.slice();
    }
    getRecipe(index: number) {
        return this.recipes[index];
    }
    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }
    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }
    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
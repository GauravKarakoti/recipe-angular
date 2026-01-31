import { Component, OnDestroy } from '@angular/core';
import { ShoppingEdit } from "./shopping-edit/shopping-edit";
import { Ingredient } from '../shared/ingredient.model';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  imports: [ShoppingEdit, CommonModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList implements OnDestroy {
  ingredients!: Ingredient[];
  private subscription!: Subscription;
  constructor(private slService: ShoppingListService, private loggingService: LoggingService) { }
  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      )
    this.loggingService.printLog("Entered Shopping List Page");
  }
  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

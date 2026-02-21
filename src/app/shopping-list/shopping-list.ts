import { Component, OnDestroy } from '@angular/core';
import { ShoppingEdit } from "./shopping-edit/shopping-edit";
import { Ingredient } from '../shared/ingredient.model';
import { CommonModule } from '@angular/common';
import { 
  Observable,
  Subscription
} from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  imports: [ShoppingEdit, CommonModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList implements OnDestroy {
  ingredients!: Observable<{ ingredients: Ingredient[] }>;
  private subscription!: Subscription;
  constructor(private loggingService: LoggingService, private store: Store<fromApp.AppState>) { }
  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged
    //   .subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   )
    this.loggingService.printLog("Entered Shopping List Page");
  }
  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}

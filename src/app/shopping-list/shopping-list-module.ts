import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingList } from './shopping-list';
import { SharedModule } from '../shared/shared-module';
// import { LoggingService } from '../logging.service';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ShoppingList },
    ])
  ],
  // providers: [LoggingService]
})
export class ShoppingListModule { }

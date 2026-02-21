import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dropdown } from "../shared/dropdown";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { map, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.action';
import * as RecipeActions from '../recipes/store/recipe.action';

@Component({
  selector: 'app-header',
  imports: [Dropdown, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
})
export class Header implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub!: Subscription;
  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }
  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }
  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

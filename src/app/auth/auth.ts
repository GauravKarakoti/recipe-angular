import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { LoadingSpinner } from "../shared/loading-spinner/loading-spinner";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Alert } from '../shared/alert/alert';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, LoadingSpinner, CommonModule, PlaceholderDirective],
  templateUrl: './auth.html',
})
export class Auth implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost!: PlaceholderDirective;
  private closeSub!: Subscription;
  private storeSub!: Subscription;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error) {
        this.showErrorAlert(this.error);
      }
    })
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }
    form.reset();
  }
  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }
  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
  private showErrorAlert(message: string) {
    // const alertCmp = new Alert();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(Alert);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}

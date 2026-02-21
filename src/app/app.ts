import { Component, OnInit } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core-module';
import { LoggingService } from './logging.service';
import { SharedModule } from './shared/shared-module';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.action';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, CoreModule, SharedModule], 
  templateUrl: './app.html',
  styleUrl: './app.css',
  // providers: [LoggingService]
})
export class App implements OnInit {
  constructor(private store: Store<fromApp.AppState>, private loggingService: LoggingService) {}
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.loggingService.printLog("Welcome to recipe-angular")
  }
}
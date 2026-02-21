import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core-module';
import { LoggingService } from './logging.service';
import { SharedModule } from './shared/shared-module';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.action';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, CoreModule, SharedModule], 
  templateUrl: './app.html',
  styleUrl: './app.css',
  // providers: [LoggingService]
})
export class App implements OnInit {
  constructor(private store: Store<fromApp.AppState>, private loggingService: LoggingService, @Inject(PLATFORM_ID) private platformId: any) {}
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
    this.loggingService.printLog("Welcome to recipe-angular")
  }
}
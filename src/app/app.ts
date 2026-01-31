import { Component, OnInit } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CoreModule } from './core-module';
import { LoggingService } from './logging.service';
import { SharedModule } from './shared/shared-module';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, CoreModule, SharedModule], 
  templateUrl: './app.html',
  styleUrl: './app.css',
  // providers: [LoggingService]
})
export class App implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService) {}
  ngOnInit() {
    this.authService.autoLogin();
    this.loggingService.printLog("Welcome to recipe-angular")
  }
}
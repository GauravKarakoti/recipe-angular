import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  @Input() message!: string;
  @Output() close = new EventEmitter<void>();
  onClose() {
    this.close.emit();
  }
}

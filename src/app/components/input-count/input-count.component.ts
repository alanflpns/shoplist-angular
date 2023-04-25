import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-count',
  templateUrl: './input-count.component.html',
  styleUrls: ['./input-count.component.scss'],
})
export class InputCountComponent {
  @Input() quantity: FormControl<number | null> = new FormControl(1);
  @Input() lessQuantity(): void {}
  @Input() moreQuantity(): void {}
}

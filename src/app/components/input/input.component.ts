import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() name: FormControl<string | null> = new FormControl('')
  @Input() autoFocus: boolean = false
  @Input() noBorder: boolean = false
  @Input() width: string = ''
}

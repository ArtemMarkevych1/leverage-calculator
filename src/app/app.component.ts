import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  investForm: FormGroup;
  moneyInDeal: number = 0;

  constructor() {
    this.investForm = new FormGroup({
      deposit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      stopLossInPercents: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      entryPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      stopLossPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      leverage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  calculateData(): void {
    const movement = Number(this.investForm.value.entryPrice) > Number(this.investForm.value.stopLossPrice)
      ? Number(((1 - (Number(this.investForm.value.stopLossPrice) / Number(this.investForm.value.entryPrice))) * 100).toFixed(2)) // long
      : Number((((Number(this.investForm.value.stopLossPrice) / Number(this.investForm.value.entryPrice)) - 1) * 100).toFixed(2)); // short

    this.moneyInDeal =
      Number((Number(this.investForm.value.deposit)
        * Number(this.investForm.value.stopLossInPercents) / 100
        * (100 / (movement * Number(this.investForm.value.leverage)))).toFixed(2));
  }

  onSubmit(): void {
    this.calculateData()
  }

}

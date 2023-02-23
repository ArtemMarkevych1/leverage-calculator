import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  investForm!: FormGroup;
  moneyInDeal: number = 0;

  constructor(private fb: FormBuilder) {
  }

  initializeForm(): void {
    this.investForm = this.fb.group({
      deposit: ['', Validators.pattern('^[0-9]*$')],
      stopLossInPercents: ['', Validators.pattern('^[0-9]*$')],
      entryPrice: ['', Validators.pattern('^[0-9]*$')],
      stopLossPrice: ['', Validators.pattern('^[0-9]*$')],
      leverage: ['', Validators.pattern('^[0-9]*$')]
    });


    // this.investForm = this.fb.group({
    //   deposit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    //   stopLossInPercents: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    //   entryPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    //   stopLossPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    //   leverage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    // })
  }

  calculateData(): void {
    const priceMovement = Number(this.investForm.value.entryPrice) > Number(this.investForm.value.stopLossPrice)
      ? Number(((1 - (Number(this.investForm.value.stopLossPrice) / Number(this.investForm.value.entryPrice))) * 100).toFixed(2)) // long
      : Number((((Number(this.investForm.value.stopLossPrice) / Number(this.investForm.value.entryPrice)) - 1) * 100).toFixed(2)); // short

    this.moneyInDeal =
      Number((Number(this.investForm.value.deposit)
        * Number(this.investForm.value.stopLossInPercents) / 100
        * (100 / (priceMovement * Number(this.investForm.value.leverage)))).toFixed(2));
  }

  onSubmit(): void {
    this.calculateData();
  }

  hasEmptyFields(): boolean {
    return Object.values(this.investForm.value).some(value => value === '');
  }

  ngOnInit(): void {
    this.initializeForm();
  }

}

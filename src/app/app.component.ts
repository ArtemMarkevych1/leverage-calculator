import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  investForm!: FormGroup;
  moneyInDeal: number = 0;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {

    const pattern = /[0-9]+([,.][0-9]{1,2})?/;

    this.investForm = this.fb.group({
      deposit: ['', Validators.pattern(pattern)],
      stopLossInPercents: ['', Validators.pattern(pattern)],
      entryPrice: ['', Validators.pattern(pattern)],
      stopLossPrice: ['', Validators.pattern(pattern)],
      leverage: ['', Validators.pattern(pattern)]
    });
  }

  calculateData(): void {
    const priceMovement = this.investForm.value.entryPrice > this.investForm.value.stopLossPrice
      ? (1 - this.investForm.value.stopLossPrice / this.investForm.value.entryPrice) * 100 // long position
      : ((this.investForm.value.stopLossPrice / this.investForm.value.entryPrice) - 1) * 100; // short position

    this.moneyInDeal = this.appService.roundNumber(
      this.investForm.value.deposit
      * this.investForm.value.stopLossInPercents / 100
      * (100 / (priceMovement * this.investForm.value.leverage))
    );
  }

  onSubmit(): void {
    this.calculateData();
  }

  hasEmptyFields(): boolean {
    return this.appService.hasEmptyFields(this.investForm.value);
  }

  isNaNValue(number: number): number {
    return this.appService.isNaNValue(number);
  }

  resetForm() {
    this.investForm.reset();
  }
}

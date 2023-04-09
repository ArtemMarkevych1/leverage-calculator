import {Component, HostBinding, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AppService} from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Isolated margin';
  investForm!: FormGroup;
  moneyInDeal = 0;
  pattern = /^(0*[1-9][0-9]*([.][0-9]*)?|[+]?0*[1-9][0-9]*([.][0-9]*)?)$/;

  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);

  constructor(
    private dialog: MatDialog,
    private overlay: OverlayContainer,
    private fb: FormBuilder,
    private appService: AppService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode){
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else{
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  initializeForm(): void {

    const pattern = /^([+]?[0-9]+([.][0-9]*)?)?$/;

    this.investForm = new FormGroup({
      deposit: new FormControl('', Validators.pattern(pattern)),
      stopLossInPercents: new FormControl('', Validators.pattern(pattern)),
      entryPrice: new FormControl('', Validators.pattern(pattern)),
      stopLossPrice: new FormControl('', Validators.pattern(pattern)),
      leverage: new FormControl('', Validators.pattern(pattern))
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

  isNaNValue(value: number): number {
    return this.appService.isNaNValue(value);
  }

  resetForm() {
    this.investForm.reset();
    this.moneyInDeal = 0;
    this.investForm.markAsPristine();
    this.investForm.markAsUntouched();
  }
}

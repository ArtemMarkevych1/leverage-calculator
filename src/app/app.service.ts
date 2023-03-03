import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class AppService {

  roundNumber(numValue: number): number {
    return Number(numValue.toFixed(2));
  }

  isNaNValue(number: number): number{
    return isNaN(number) ? 0 : number
  }

  hasEmptyFields(form: FormGroup): boolean {
    return Object.values(form).some(value => value === '');
  }
}

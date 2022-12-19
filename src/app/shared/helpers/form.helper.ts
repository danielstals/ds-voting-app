import { AbstractControl } from '@angular/forms';

export class AbstractControlHelper {
  public static getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required') && control.touched) {
      return 'You must enter a value';
    } else if (control.hasError('maxlength')) {
      return 'This field has a maximum length of 80';
    }
    return '';
  }
}

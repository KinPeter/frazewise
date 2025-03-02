import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const STRICT_URL_REGEX = new RegExp(
  // eslint-disable-next-line
  /^http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%{}!\$&'\(\)\*\+,;=.]+$/
);

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    if (
      !control.value ||
      (typeof control.value === 'string' &&
        control.value !== '' &&
        STRICT_URL_REGEX.test(control.value.trim()))
    ) {
      return null;
    }
    return { url: true };
  }

  static oneOf(array: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = array.includes(control.value);
      return isValid ? null : { oneOf: true };
    };
  }
}

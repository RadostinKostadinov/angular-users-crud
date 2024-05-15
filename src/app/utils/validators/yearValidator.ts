import { AbstractControl } from '@angular/forms';

export function YearValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value > 1900 && control.value <= new Date().getUTCFullYear()) {
    return null;
  }
  return { year: true };
}

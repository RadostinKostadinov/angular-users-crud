import { AbstractControl } from '@angular/forms';

export function DayValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value >= 1 && control.value <= 31) {
    return null;
  }
  return { day: true };
}

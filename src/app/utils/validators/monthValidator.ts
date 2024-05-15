import { AbstractControl } from '@angular/forms';

export const validMonthTypes = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function MonthValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value >= 1 && control.value <= 12) {
    return null;
  }
  return { month: true };
}

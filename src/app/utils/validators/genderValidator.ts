import { AbstractControl } from '@angular/forms';

export const validGenderTypes = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function GenderValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (validGenderTypes.find((type) => type.value === control.value)) {
    return null;
  }
  return { gender: true };
}

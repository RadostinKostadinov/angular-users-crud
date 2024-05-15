import { ValidatorFn } from '@angular/forms';

export function BirthDateValidator(): ValidatorFn {
  return (formGroup: any) => {
    const yearControl = formGroup.controls['birthDate'].controls['year'];
    const monthControl = formGroup.controls['birthDate'].controls['month'];
    const dayControl = formGroup.controls['birthDate'].controls['day'];
    const selectedDate = new Date(
      yearControl.value || 9999,
      monthControl.value || 0,
      dayControl.value || 1
    );
    const today = new Date();
    if (selectedDate < today) {
      return null;
    }
    return { birthDate: true };
  };
}

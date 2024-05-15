import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  GenderValidator,
  validGenderTypes,
} from '../../utils/validators/genderValidator';
import { YearValidator } from '../../utils/validators/yearValidator';
import {
  MonthValidator,
  validMonthTypes,
} from '../../utils/validators/monthValidator';
import { DayValidator } from '../../utils/validators/dayValidator';
import { BirthDateValidator } from '../../utils/validators/birthDateValidator';
import { first } from 'rxjs';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-user-form',
  templateUrl: './add-edit-user-form.component.html',
  styleUrl: './add-edit-user-form.component.scss',
})
export class AddEditUserFormComponent implements OnInit {
  id: string = '';
  isAddMode: boolean = true;
  isLoading = false;
  isSubmitted = false;
  isGenderChanged = false;
  isYearChanged = false;
  isMonthChanged = false;
  isDayChanged = false;
  genderTypes = [
    { value: '', label: 'Please select', disabled: true },
    ...validGenderTypes,
  ];
  selectYears = getSelectYears(1900, new Date().getUTCFullYear());
  selectMonths = [
    { value: 13, label: 'Month', disabled: true },
    ...validMonthTypes,
  ];
  selectDays = getSelectDays(2023, 2);

  form = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z]*$'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z]*$'),
      ]),
      profession: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern('^(\\w+\\s)*\\w+$'),
      ]),
      gender: new FormControl('', [Validators.required, GenderValidator]),
      birthDate: new FormGroup({
        year: new FormControl(0, [Validators.required, YearValidator]),
        month: new FormControl(13, [Validators.required, MonthValidator]),

        day: new FormControl(0, [Validators.required, DayValidator]),
      }),
    },
    {
      // ToDo: Improve date validation (compare day w/ valid month days)
      validators: [BirthDateValidator()],
    }
  );

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private modalService: ModalService
  ) {}

  get userFormControl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.userService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => {
          this.form.patchValue({
            firstName: x.firstName,
            lastName: x.lastName,
            profession: x.profession,
            gender: x.gender,
            birthDate: {
              year: +x.birthDate!.split('-')[0],
              month: +x.birthDate!.split('-')[1],
              day: +x.birthDate!.split('-')[2],
            },
          });

          this.isGenderChanged = true;
          this.genderTypes = this.genderTypes.splice(1);
          this.isYearChanged = true;
          this.selectYears = this.selectYears.splice(1);
          this.isMonthChanged = true;
          this.selectMonths = this.selectMonths.splice(1);
          this.selectDays = getSelectDays(
            +x.birthDate!.split('-')[0],
            +x.birthDate!.split('-')[1]
          );
          this.isDayChanged = true;
          this.selectDays = this.selectDays.splice(1);
        });
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.modalService.open('add-edit-user-form-modal');
  }

  onModalConfirm() {
    const year = this.form.value.birthDate!.year!;
    const month = this.form.value.birthDate!.month!.toString().padStart(2, '0');
    const day = this.form.value.birthDate!.day!.toString().padStart(2, '0');

    const user: User = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      profession: this.form.value.profession!,
      gender: this.form.value.gender!,
      birthDate: `${year}-${month}-${day}`,
    };

    if (this.isAddMode) {
      this.createUser(user);
    } else {
      this.updateUser(user);
    }
  }

  onModalCancel() {
    this.modalService.close();
  }

  private createUser(user: User) {
    this.userService
      .create(user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.success('User added');
          this.modalService.close();
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toastrService.success('Error occurred while adding user');
          this.modalService.close();
          this.isLoading = false;
        },
      });
  }

  private updateUser(user: User) {
    this.userService
      .update(this.id, user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.success('User updated');
          this.modalService.close();
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toastrService.error('Error occurred while updating user');
          this.isLoading = false;
        },
      });
  }

  onGenderSelect() {
    if (!this.isGenderChanged) {
      this.isGenderChanged = true;
      this.genderTypes = this.genderTypes.splice(1);
    }
  }

  onYearSelect() {
    if (!this.isYearChanged) {
      this.isYearChanged = true;
      this.selectYears = this.selectYears.splice(1);
    }

    if (this.isMonthChanged) {
      this.selectDays = getSelectDays(
        this.form.value.birthDate?.year || 1980,
        this.form.value.birthDate?.month || 0,
        false
      );
    }

    if (this.isDayChanged) {
      const dayField = this.form.get('birthDate.day')!;
      const selectedDay = dayField.value!;
      const latestDay = this.selectDays.slice(-1)[0].value;
      if (selectedDay > latestDay) {
        dayField.setValue(latestDay);
      }
    }
  }
  onMonthSelect(selected: { value: number; label: string }) {
    this.selectDays = getSelectDays(
      this.form.value.birthDate!.year!,
      selected.value,
      false
    );

    if (!this.isMonthChanged) {
      this.isMonthChanged = true;
      this.selectMonths = this.selectMonths.splice(1);
    }

    if (this.isDayChanged) {
      this.selectDays = getSelectDays(
        this.form.value.birthDate!.year!,
        selected.value,
        false
      );

      const dayField = this.form.get('birthDate.day')!;
      const selectedDay = dayField.value!;
      const latestDay = this.selectDays.slice(-1)[0].value;
      if (selectedDay > latestDay) {
        dayField.setValue(latestDay);
      }
    } else {
      this.selectDays = getSelectDays(
        this.form.value.birthDate!.year!,
        selected.value,
        true
      );
    }
  }

  onDaySelect(selected: { value: number; label: number }) {
    if (!this.isDayChanged) {
      this.isDayChanged = true;
      this.selectDays = this.selectDays.splice(1);
    }
  }

  onFocusSelect(selectName: string) {
    const ngSelect = document.querySelector(
      'ng-select[name="' + selectName + '"]'
    );
    ngSelect?.classList.add('ng-select-focused');
  }
}

function getSelectYears(
  from: number,
  to: number
): { value: number; label: string | number; disabled?: boolean }[] {
  const years: { value: number; label: string | number; disabled?: boolean }[] =
    [{ value: 0, label: 'Year', disabled: true }];
  for (let i = to; i > from; i--) {
    years.push({ value: i, label: i });
  }
  return years;
}

function getSelectDays(
  year: number,
  month: number,
  addPlaceholder = true
): { value: number; label: string | number; disabled?: boolean }[] {
  const daysInMonth = getDaysInMonth(year, month);
  const days: { value: number; label: string | number; disabled?: boolean }[] =
    addPlaceholder ? [{ value: 0, label: 'Day', disabled: true }] : [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ value: i, label: i });
  }
  return days;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

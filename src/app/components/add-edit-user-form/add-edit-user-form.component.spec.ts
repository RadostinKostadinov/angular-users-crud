import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserFormComponent } from './add-edit-user-form.component';

describe('AddEditUserFormComponent', () => {
  let component: AddEditUserFormComponent;
  let fixture: ComponentFixture<AddEditUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUserFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

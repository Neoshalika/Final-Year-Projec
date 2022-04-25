import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Prorderemployee} from '../../../../../entities/prorderemployee';
import {Employee} from '../../../../../entities/employee';
import {DateHelper} from '../../../../../shared/date-helper';
import {EmployeeService} from '../../../../../services/employee.service';

@Component({
  selector: 'app-prorderemployee-update-sub-form',
  templateUrl: './prorderemployee-update-sub-form.component.html',
  styleUrls: ['./prorderemployee-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProrderemployeeUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProrderemployeeUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ProrderemployeeUpdateSubFormComponent extends AbstractSubFormComponent<Prorderemployee> implements OnInit{

  employees: Employee[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    employee: new FormControl(),
    date: new FormControl(),
    edate: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get edateField(): FormControl{
    return this.form.controls.edate as FormControl;
  }



  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.employeeField)
      &&   this.isEmptyField(this.dateField)
      &&   this.isEmptyField(this.edateField);
  }

  constructor(
    private employeeService: EmployeeService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.dateField.setValidators([Validators.required]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.employeeField.clearValidators();
    this.dateField.clearValidators();
    this.edateField.clearValidators();
  }

  fillForm(dataItem: Prorderemployee): void {
    this.idField.patchValue(dataItem.id);
    this.employeeField.patchValue(dataItem.employee.id);
    this.dateField.patchValue(dataItem.date);
    this.edateField.patchValue(dataItem.edate);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(prorderemployee: Prorderemployee): string {
    return 'Are you sure to remove \u201C ' + prorderemployee.date + ' \u201D from production order employee?';
  }

  getUpdateConfirmMessage(prorderemployee: Prorderemployee): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + prorderemployee.date + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + prorderemployee.date + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Prorderemployee = new Prorderemployee();
    dataItem.id = this.idField.value;

    for (const employee of this.employees){
      if (this.employeeField.value === employee.id) {
        dataItem.employee = employee;
        break;
      }
    }

    dataItem.date = DateHelper.getDateAsString(this.dateField.value);
    dataItem.edate = this.edateField.value ? DateHelper.getDateAsString(this.edateField.value) : null;
    this.addToTop(dataItem);
    this.resetForm();
  }

  getValues(): Prorderemployee[]{
    const porderemployees: Prorderemployee[] = [];

    for (const ob of this.dataList){
      const newob = new Prorderemployee();
      newob.edate = ob.edate;
      newob.date = ob.date;
      newob.id = ob.id;
      // @ts-ignore
      newob.employee = ob.employee.id;
      porderemployees.push(newob);
    }

    return porderemployees;
  }

  customValidations(): object {
    return null;
  }

  dateVaildation() {
    return new Date();
  }
}

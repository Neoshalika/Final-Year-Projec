import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {DateHelper} from '../../../../shared/date-helper';
import {Civilstatus} from '../../../../entities/civilstatus';
import {Designation} from '../../../../entities/designation';
import {GenderService} from '../../../../services/gender.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {DesignationService} from '../../../../services/designation.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent extends AbstractComponent implements OnInit {

  nametitles: Nametitle[] = [];
  civilstatuses: Civilstatus[] = [];
  designations: Designation[] = [];
  genders: Gender[] = [];


  maxBirthday = new Date();

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    civilstatus: new FormControl(null, [
      Validators.required,
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    photo: new FormControl(),
    designation: new FormControl(null, [
      Validators.required,
    ]),
    dorecruit: new FormControl(new Date(), [
      Validators.required,
    ]),
    dobirth: new FormControl(null, [
      Validators.required,
    ]),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][7][0-9]{8}$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    etfno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    daysalary: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
  }

  get civilstatusField(): FormControl{
    return this.form.controls.civilstatus as FormControl;
  }

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }

  get dorecruitField(): FormControl{
    return this.form.controls.dorecruit as FormControl;
  }

  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get etfnoField(): FormControl{
    return this.form.controls.etfno as FormControl;
  }

  get daysalaryField(): FormControl{
    return this.form.controls.daysalary as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private civilstatusService: CivilstatusService,
    private designationService: DesignationService,
    private genderService: GenderService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();

    this.maxBirthday.setFullYear(this.maxBirthday.getFullYear() - 16);
  }

  onChangeDesignation(): void{
    if (this.designationField.value === 5){
      this.daysalaryField.setValue(0.00);
    }
  }

  ngOnInit(): void {
    this.civilstatusService.getAll().then((civilstatuses) => {
      this.civilstatuses = civilstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.designationService.getAll().then((designations) => {
      this.designations = designations;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EMPLOYEE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const employee: Employee = new Employee();
    employee.nametitle = this.nametitleField.value;
    employee.callingname = this.callingnameField.value;
    employee.civilstatus = this.civilstatusField.value;
    employee.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      employee.photo = photoIds[0];
    }else{
      employee.photo = null;
    }
    employee.designation = this.designationField.value;
    employee.dorecruit = DateHelper.getDateAsString(this.dorecruitField.value);
    employee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    employee.gender = this.genderField.value;
    employee.nic = this.nicField.value;
    employee.mobile = this.mobileField.value;
    employee.land = this.landField.value;
    employee.email = this.emailField.value;
    employee.etfno = this.etfnoField.value;
    employee.daysalary = this.daysalaryField.value;
    employee.address = this.addressField.value;
    employee.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.employeeService.add(employee);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/employees/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.callingname) { this.callingnameField.setErrors({server: msg.callingname}); knownError = true; }
          if (msg.civilstatus) { this.civilstatusField.setErrors({server: msg.civilstatus}); knownError = true; }
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }
          if (msg.dorecruit) { this.dorecruitField.setErrors({server: msg.dorecruit}); knownError = true; }
          if (msg.dobirth) { this.dobirthField.setErrors({server: msg.dobirth}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.etfno) { this.etfnoField.setErrors({server: msg.etfno}); knownError = true; }
          if (msg.daysalary) { this.daysalaryField.setErrors({server: msg.daysalary}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}





























/*
validateNIC(): void {
  if (this.nicField.value.length === 12){
  const year = Number(String(this.nicField.value).slice(0, 4));
  const currYear: number = new Date().getFullYear();
  const minYears: number = currYear - 16;

  if (year >= minYears){
    this.nicField.setErrors({minYearsOld: true});
    this.basicDetailsFormGroup.updateValueAndValidity();
  }
}
}

validateDOB(): void {
  const year = Number(String(DateHelper.getDateAsString(this.dobirthField.value)).slice(0, 4));
  const currYear: number = new Date().getFullYear();
const minYears: number = currYear - 16;

if (year >= minYears){
  this.dobirthField.setErrors({minYearsOld: true});
  this.basicDetailsFormGroup.updateValueAndValidity();
}

if (this.nicField.valid && this.dobirthField.valid){
  let nicYear = null;
  if (this.nicField.value.length === 12){
    nicYear = Number(String(this.nicField.value).slice(0, 4));
  }
  if (this.nicField.value.length === 10){
    nicYear = Number('19' + String(this.nicField.value).slice(0, 2));
  }

  if (nicYear !== year){
    this.dobirthField.setErrors({mismatch: true});
    this.basicDetailsFormGroup.updateValueAndValidity();
  }
}
}*/

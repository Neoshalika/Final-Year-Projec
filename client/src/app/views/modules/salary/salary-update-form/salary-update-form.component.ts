import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Salary} from '../../../../entities/salary';
import {SalaryService} from '../../../../services/salary.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Advancedpayment} from '../../../../entities/advancedpayment';
import {EmployeeService} from '../../../../services/employee.service';
import {AdvancedpaymentService} from '../../../../services/advancedpayment.service';
import {AllowanceUpdateSubFormComponent} from './allowance-update-sub-form/allowance-update-sub-form.component';
import {DeductionUpdateSubFormComponent} from './deduction-update-sub-form/deduction-update-sub-form.component';
import {SalaryloanUpdateSubFormComponent} from './salaryloan-update-sub-form/salaryloan-update-sub-form.component';

@Component({
  selector: 'app-salary-update-form',
  templateUrl: './salary-update-form.component.html',
  styleUrls: ['./salary-update-form.component.scss']
})
export class SalaryUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  salary: Salary;

  employees: Employee[] = [];
  advancedpayments: Advancedpayment[] = [];
  @ViewChild(AllowanceUpdateSubFormComponent) allowanceUpdateSubForm: AllowanceUpdateSubFormComponent;
  @ViewChild(SalaryloanUpdateSubFormComponent) salaryloanUpdateSubForm: SalaryloanUpdateSubFormComponent;
  @ViewChild(DeductionUpdateSubFormComponent) deductionUpdateSubForm: DeductionUpdateSubFormComponent;

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    month: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    epf: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    etf: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    grossincome: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    netsalary: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,9}([.][0-9]{1,1})?)$'),
    ]),
    advancedpayments: new FormControl(),
    allowances: new FormControl(),
    salaryloans: new FormControl(),
    deductions: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get monthField(): FormControl{
    return this.form.controls.month as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get epfField(): FormControl{
    return this.form.controls.epf as FormControl;
  }

  get etfField(): FormControl{
    return this.form.controls.etf as FormControl;
  }

  get grossincomeField(): FormControl{
    return this.form.controls.grossincome as FormControl;
  }

  get netsalaryField(): FormControl{
    return this.form.controls.netsalary as FormControl;
  }

  get advancedpaymentsField(): FormControl{
    return this.form.controls.advancedpayments as FormControl;
  }

  get allowancesField(): FormControl{
    return this.form.controls.allowances as FormControl;
  }

  get salaryloansField(): FormControl{
    return this.form.controls.salaryloans as FormControl;
  }

  get deductionsField(): FormControl{
    return this.form.controls.deductions as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private advancedpaymentService: AdvancedpaymentService,
    private salaryService: SalaryService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.advancedpaymentService.getAllBasic(new PageRequest()).then((advancedpaymentDataPage) => {
      this.advancedpayments = advancedpaymentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.salary = await this.salaryService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALARY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SALARIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SALARY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALARY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALARY);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.salary.employee.id);
    }
    if (this.monthField.pristine) {
      this.monthField.setValue(this.salary.month);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.salary.date);
    }
    if (this.epfField.pristine) {
      this.epfField.setValue(this.salary.epf);
    }
    if (this.etfField.pristine) {
      this.etfField.setValue(this.salary.etf);
    }
    if (this.grossincomeField.pristine) {
      this.grossincomeField.setValue(this.salary.grossincome);
    }
    if (this.netsalaryField.pristine) {
      this.netsalaryField.setValue(this.salary.netsalary);
    }
    if (this.advancedpaymentsField.pristine) {
      this.advancedpaymentsField.setValue(this.salary.advancedpaymentList);
    }
    if (this.allowancesField.pristine) {
      this.allowancesField.setValue(this.salary.allowanceList);
    }
    if (this.salaryloansField.pristine) {
      this.salaryloansField.setValue(this.salary.salaryloanList);
    }
    if (this.deductionsField.pristine) {
      this.deductionsField.setValue(this.salary.deductionList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.salary.description);
    }
}

  async submit(): Promise<void> {
    this.advancedpaymentsField.updateValueAndValidity();
    this.advancedpaymentsField.markAsTouched();
    this.allowanceUpdateSubForm.resetForm();
    this.allowancesField.markAsDirty();
    this.salaryloanUpdateSubForm.resetForm();
    this.salaryloansField.markAsDirty();
    this.deductionUpdateSubForm.resetForm();
    this.deductionsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newsalary: Salary = new Salary();
    newsalary.employee = this.employeeField.value;
    newsalary.month = DateHelper.getDateAsString(this.monthField.value);
    newsalary.date = DateHelper.getDateAsString(this.dateField.value);
    newsalary.epf = this.epfField.value;
    newsalary.etf = this.etfField.value;
    newsalary.grossincome = this.grossincomeField.value;
    newsalary.netsalary = this.netsalaryField.value;
    newsalary.advancedpaymentList = this.advancedpaymentsField.value;
    newsalary.allowanceList = this.allowancesField.value;
    newsalary.salaryloanList = this.salaryloansField.value;
    newsalary.deductionList = this.deductionsField.value;
    newsalary.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.salaryService.update(this.selectedId, newsalary);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/salaries/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/salaries');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.month) { this.monthField.setErrors({server: msg.month}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.epf) { this.epfField.setErrors({server: msg.epf}); knownError = true; }
          if (msg.etf) { this.etfField.setErrors({server: msg.etf}); knownError = true; }
          if (msg.grossincome) { this.grossincomeField.setErrors({server: msg.grossincome}); knownError = true; }
          if (msg.netsalary) { this.netsalaryField.setErrors({server: msg.netsalary}); knownError = true; }
          if (msg.advancedpaymentList) { this.advancedpaymentsField.setErrors({server: msg.advancedpaymentList}); knownError = true; }
          if (msg.allowanceList) { this.allowancesField.setErrors({server: msg.allowanceList}); knownError = true; }
          if (msg.salaryloanList) { this.salaryloansField.setErrors({server: msg.salaryloanList}); knownError = true; }
          if (msg.deductionList) { this.deductionsField.setErrors({server: msg.deductionList}); knownError = true; }
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

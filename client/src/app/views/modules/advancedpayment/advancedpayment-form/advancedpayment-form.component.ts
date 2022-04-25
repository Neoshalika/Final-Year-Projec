import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Advancedpayment} from '../../../../entities/advancedpayment';
import {AdvancedpaymentService} from '../../../../services/advancedpayment.service';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-advancedpayment-form',
  templateUrl: './advancedpayment-form.component.html',
  styleUrls: ['./advancedpayment-form.component.scss']
})
export class AdvancedpaymentFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private advancedpaymentService: AdvancedpaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ADVANCEDPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ADVANCEDPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ADVANCEDPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ADVANCEDPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const advancedpayment: Advancedpayment = new Advancedpayment();
    advancedpayment.employee = this.employeeField.value;
    advancedpayment.date = DateHelper.getDateAsString(this.dateField.value);
    advancedpayment.amount = this.amountField.value;
    advancedpayment.reason = this.reasonField.value;
    try{
      const resourceLink: ResourceLink = await this.advancedpaymentService.add(advancedpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/advancedpayments/' + resourceLink.id);
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
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
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

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Loan} from '../../../../entities/loan';
import {LoanService} from '../../../../services/loan.service';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {EmployeeService} from '../../../../services/employee.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-loan-update-form',
  templateUrl: './loan-update-form.component.html',
  styleUrls: ['./loan-update-form.component.scss']
})
export class LoanUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  loan: Loan;

  employees: Employee[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    paymentstatus: new FormControl('1', [
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
    monthlyinstallment: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    balance: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    chequeno: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[0-9]{5,}$'),
    ]),
    chequebank: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    chequebranch: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    chequedate: new FormControl(null, [
      Validators.required,
    ]),
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get monthlyinstallmentField(): FormControl{
    return this.form.controls.monthlyinstallment as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
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
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loan = await this.loanService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOAN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.loan.employee.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.loan.paymenttype.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.loan.paymentstatus.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.loan.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.loan.amount);
    }
    if (this.monthlyinstallmentField.pristine) {
      this.monthlyinstallmentField.setValue(this.loan.monthlyinstallment);
    }
    if (this.balanceField.pristine) {
      this.balanceField.setValue(this.loan.balance);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.loan.chequeno);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.loan.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.loan.chequebranch);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.loan.chequedate);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.loan.reason);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newloan: Loan = new Loan();
    newloan.employee = this.employeeField.value;
    newloan.paymenttype = this.paymenttypeField.value;
    newloan.paymentstatus = this.paymentstatusField.value;
    newloan.date = DateHelper.getDateAsString(this.dateField.value);
    newloan.amount = this.amountField.value;
    newloan.monthlyinstallment = this.monthlyinstallmentField.value;
    newloan.balance = this.balanceField.value;
    newloan.chequeno = this.chequenoField.value;
    newloan.chequebank = this.chequebankField.value;
    newloan.chequebranch = this.chequebranchField.value;
    newloan.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newloan.reason = this.reasonField.value;
    try{
      const resourceLink: ResourceLink = await this.loanService.update(this.selectedId, newloan);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/loans/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/loans');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.monthlyinstallment) { this.monthlyinstallmentField.setErrors({server: msg.monthlyinstallment}); knownError = true; }
          if (msg.balance) { this.balanceField.setErrors({server: msg.balance}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
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

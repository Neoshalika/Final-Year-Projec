import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Loanrepayment} from '../../../../entities/loanrepayment';
import {LoanrepaymentService} from '../../../../services/loanrepayment.service';
import {Loan} from '../../../../entities/loan';
import {DateHelper} from '../../../../shared/date-helper';
import {LoanService} from '../../../../services/loan.service';

@Component({
  selector: 'app-loanrepayment-form',
  templateUrl: './loanrepayment-form.component.html',
  styleUrls: ['./loanrepayment-form.component.scss']
})
export class LoanrepaymentFormComponent extends AbstractComponent implements OnInit {

  loans: Loan[] = [];

  form = new FormGroup({
    loan: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get loanField(): FormControl{
    return this.form.controls.loan as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private loanService: LoanService,
    private loanrepaymentService: LoanrepaymentService,
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

    this.loanService.getAllBasic(new PageRequest()).then((loanDataPage) => {
      this.loans = loanDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOANREPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANREPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOANREPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOANREPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOANREPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const loanrepayment: Loanrepayment = new Loanrepayment();
    loanrepayment.loan = this.loanField.value;
    loanrepayment.date = DateHelper.getDateAsString(this.dateField.value);
    loanrepayment.amount = this.amountField.value;
    loanrepayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.loanrepaymentService.add(loanrepayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/loanrepayments/' + resourceLink.id);
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
          if (msg.loan) { this.loanField.setErrors({server: msg.loan}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
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

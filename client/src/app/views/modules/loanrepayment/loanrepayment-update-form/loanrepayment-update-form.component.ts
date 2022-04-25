import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Loanrepayment} from '../../../../entities/loanrepayment';
import {LoanrepaymentService} from '../../../../services/loanrepayment.service';
import {Loan} from '../../../../entities/loan';
import {DateHelper} from '../../../../shared/date-helper';
import {LoanService} from '../../../../services/loan.service';

@Component({
  selector: 'app-loanrepayment-update-form',
  templateUrl: './loanrepayment-update-form.component.html',
  styleUrls: ['./loanrepayment-update-form.component.scss']
})
export class LoanrepaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  loanrepayment: Loanrepayment;

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

    this.loanService.getAllBasic(new PageRequest()).then((loanDataPage) => {
      this.loans = loanDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loanrepayment = await this.loanrepaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOANREPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANREPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOANREPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOANREPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOANREPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.loanField.pristine) {
      this.loanField.setValue(this.loanrepayment.loan.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.loanrepayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.loanrepayment.amount);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.loanrepayment.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newloanrepayment: Loanrepayment = new Loanrepayment();
    newloanrepayment.loan = this.loanField.value;
    newloanrepayment.date = DateHelper.getDateAsString(this.dateField.value);
    newloanrepayment.amount = this.amountField.value;
    newloanrepayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.loanrepaymentService.update(this.selectedId, newloanrepayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/loanrepayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/loanrepayments');
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

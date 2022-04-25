import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customerpayment} from '../../../../entities/customerpayment';
import {CustomerpaymentService} from '../../../../services/customerpayment.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Customerorder} from '../../../../entities/customerorder';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {CustomerService} from '../../../../services/customer.service';
import {Customer} from '../../../../entities/customer';

@Component({
  selector: 'app-customerpayment-form',
  templateUrl: './customerpayment-form.component.html',
  styleUrls: ['./customerpayment-form.component.scss']
})
export class CustomerpaymentFormComponent extends AbstractComponent implements OnInit {

  customerorders: Customerorder[] = [];
  paymenttypes: Paymenttype[] = [];
  customers: Customer[] = [];

  form = new FormGroup({
    customer: new FormControl(null, [
      Validators.required,
    ]),
    customerorder: new FormControl(null, [
      Validators.required,
    ]),
    paymenttype: new FormControl('1', [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    chequeno: new FormControl(),
    chequebank: new FormControl(),
    chequebranch: new FormControl(),
    chequedate: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    balance: new FormControl(null, [
    ]),
  });
  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }

  get customerorderField(): FormControl{
    return this.form.controls.customerorder as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }


  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private customerorderService: CustomerorderService,
    private paymenttypeService: PaymenttypeService,
    private customerpaymentService: CustomerpaymentService,
    private customerService: CustomerService,
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
    this.balanceField.disable();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.customerService.getAllBasic(new PageRequest()).then((customerorderDataPage) => {
      this.customers = customerorderDataPage.content;
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const customerpayment: Customerpayment = new Customerpayment();
    customerpayment.customerorder = this.customerorderField.value;
    customerpayment.paymenttype = this.paymenttypeField.value;
    customerpayment.amount = this.amountField.value;
    customerpayment.chequeno = this.chequenoField.value;
    customerpayment.chequebank = this.chequebankField.value;
    customerpayment.chequebranch = this.chequebranchField.value;
    customerpayment.chequedate = this.chequedateField ?  DateHelper.getDateAsString(this.chequedateField.value) : null ;
    customerpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerpaymentService.add(customerpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerpayments/' + resourceLink.id);
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
          if (msg.customerorder) { this.customerorderField.setErrors({server: msg.customerorder}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
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
  loadOrder(): void{
    this.customerorderService.getAllForPaymentByCustomer(this.customerField.value).then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updateBalance(): void{
    if (this.amountField.value !== '' || this.amountField.value != null){
      this.balanceField.patchValue(parseFloat(this.customerorderField.value.balance) - parseFloat(this.amountField.value));
    }else {
      this.balanceField.patchValue(parseFloat(this.customerorderField.value));
    }
  }

  chequePaymentValidation(): void {
    if (this.paymenttypeField.value === 2){
      this.chequenoField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[0-9]{5,}$'),
      ]);
      this.chequenoField.updateValueAndValidity();
      this.chequedateField.setValidators([
        Validators.required,
      ]);
      this.chequedateField.updateValueAndValidity();
      this.chequebankField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebankField.updateValueAndValidity();
      this.chequebranchField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebranchField.updateValueAndValidity();

    }else {
      this.chequenoField.setValidators(null);
      this.chequenoField.updateValueAndValidity();
      this.chequenoField.reset();

      this.chequedateField.setValidators(null);
      this.chequedateField.updateValueAndValidity();
      this.chequedateField.reset();

      this.chequebankField.setValidators(null);
      this.chequebankField.updateValueAndValidity();
      this.chequebankField.reset();

      this.chequebranchField.setValidators(null);
      this.chequebranchField.updateValueAndValidity();
      this.chequebranchField.reset();
    }
  }
}

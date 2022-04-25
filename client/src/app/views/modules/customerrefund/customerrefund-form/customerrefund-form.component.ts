import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customerrefund} from '../../../../entities/customerrefund';
import {CustomerrefundService} from '../../../../services/customerrefund.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Customerorder} from '../../../../entities/customerorder';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {CustomerrefundproductSubFormComponent} from './customerrefundproduct-sub-form/customerrefundproduct-sub-form.component';
import {CustomorderrefunditemSubFormComponent} from './customorderrefunditem-sub-form/customorderrefunditem-sub-form.component';

@Component({
  selector: 'app-customerrefund-form',
  templateUrl: './customerrefund-form.component.html',
  styleUrls: ['./customerrefund-form.component.scss']
})
export class CustomerrefundFormComponent extends AbstractComponent implements OnInit {

  customerorders: Customerorder[] = [];
  paymenttypes: Paymenttype[] = [];
  @ViewChild(CustomerrefundproductSubFormComponent) customerrefundproductSubForm: CustomerrefundproductSubFormComponent;
  @ViewChild(CustomorderrefunditemSubFormComponent) customorderrefunditemSubForm: CustomorderrefunditemSubFormComponent;

  form = new FormGroup({
    customerorder: new FormControl(null, [
      Validators.required,
    ]),
    paymenttype: new FormControl('1', [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
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
    customerrefundproducts: new FormControl(),
    customorderrefunditems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get customerorderField(): FormControl{
    return this.form.controls.customerorder as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
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

  get customerrefundproductsField(): FormControl{
    return this.form.controls.customerrefundproducts as FormControl;
  }

  get customorderrefunditemsField(): FormControl{
    return this.form.controls.customorderrefunditems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private customerorderService: CustomerorderService,
    private paymenttypeService: PaymenttypeService,
    private customerrefundService: CustomerrefundService,
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

    this.customerorderService.getAllBasic(new PageRequest()).then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERREFUND);
  }

  async submit(): Promise<void> {
    this.customerrefundproductSubForm.resetForm();
    this.customerrefundproductsField.markAsDirty();
    this.customorderrefunditemSubForm.resetForm();
    this.customorderrefunditemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const customerrefund: Customerrefund = new Customerrefund();
    customerrefund.customerorder = this.customerorderField.value;
    customerrefund.paymenttype = this.paymenttypeField.value;
    customerrefund.date = DateHelper.getDateAsString(this.dateField.value);
    customerrefund.amount = this.amountField.value;
    customerrefund.chequeno = this.chequenoField.value;
    customerrefund.chequebank = this.chequebankField.value;
    customerrefund.chequebranch = this.chequebranchField.value;
    customerrefund.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    customerrefund.customerrefundproductList = this.customerrefundproductsField.value;
    customerrefund.customorderrefunditemList = this.customorderrefunditemsField.value;
    customerrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerrefundService.add(customerrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerrefunds/' + resourceLink.id);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.customerrefundproductList) { this.customerrefundproductsField.setErrors({server: msg.customerrefundproductList}); knownError = true; }
          if (msg.customorderrefunditemList) { this.customorderrefunditemsField.setErrors({server: msg.customorderrefunditemList}); knownError = true; }
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

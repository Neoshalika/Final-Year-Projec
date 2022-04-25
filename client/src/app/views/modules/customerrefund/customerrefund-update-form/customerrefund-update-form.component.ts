import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Customerrefund} from '../../../../entities/customerrefund';
import {CustomerrefundService} from '../../../../services/customerrefund.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Customerorder} from '../../../../entities/customerorder';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {CustomerrefundproductUpdateSubFormComponent} from './customerrefundproduct-update-sub-form/customerrefundproduct-update-sub-form.component';
import {CustomorderrefunditemUpdateSubFormComponent} from './customorderrefunditem-update-sub-form/customorderrefunditem-update-sub-form.component';

@Component({
  selector: 'app-customerrefund-update-form',
  templateUrl: './customerrefund-update-form.component.html',
  styleUrls: ['./customerrefund-update-form.component.scss']
})
export class CustomerrefundUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customerrefund: Customerrefund;

  customerorders: Customerorder[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(CustomerrefundproductUpdateSubFormComponent) customerrefundproductUpdateSubForm: CustomerrefundproductUpdateSubFormComponent;
  @ViewChild(CustomorderrefunditemUpdateSubFormComponent) customorderrefunditemUpdateSubForm: CustomorderrefunditemUpdateSubFormComponent;

  form = new FormGroup({
    customerorder: new FormControl(null, [
      Validators.required,
    ]),
    paymenttype: new FormControl('1', [
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

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
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
    private paymentstatusService: PaymentstatusService,
    private customerrefundService: CustomerrefundService,
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
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerrefund = await this.customerrefundService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERREFUND);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.customerorderField.pristine) {
      this.customerorderField.setValue(this.customerrefund.customerorder.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.customerrefund.paymenttype.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.customerrefund.paymentstatus.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.customerrefund.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.customerrefund.amount);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.customerrefund.chequeno);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.customerrefund.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.customerrefund.chequebranch);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.customerrefund.chequedate);
    }
    if (this.customerrefundproductsField.pristine) {
      this.customerrefundproductsField.setValue(this.customerrefund.customerrefundproductList);
    }
    if (this.customorderrefunditemsField.pristine) {
      this.customorderrefunditemsField.setValue(this.customerrefund.customorderrefunditemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customerrefund.description);
    }
}

  async submit(): Promise<void> {
    this.customerrefundproductUpdateSubForm.resetForm();
    this.customerrefundproductsField.markAsDirty();
    this.customorderrefunditemUpdateSubForm.resetForm();
    this.customorderrefunditemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newcustomerrefund: Customerrefund = new Customerrefund();
    newcustomerrefund.customerorder = this.customerorderField.value;
    newcustomerrefund.paymenttype = this.paymenttypeField.value;
    newcustomerrefund.paymentstatus = this.paymentstatusField.value;
    newcustomerrefund.date = DateHelper.getDateAsString(this.dateField.value);
    newcustomerrefund.amount = this.amountField.value;
    newcustomerrefund.chequeno = this.chequenoField.value;
    newcustomerrefund.chequebank = this.chequebankField.value;
    newcustomerrefund.chequebranch = this.chequebranchField.value;
    newcustomerrefund.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newcustomerrefund.customerrefundproductList = this.customerrefundproductsField.value;
    newcustomerrefund.customorderrefunditemList = this.customorderrefunditemsField.value;
    newcustomerrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerrefundService.update(this.selectedId, newcustomerrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerrefunds/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customerrefunds');
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
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
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

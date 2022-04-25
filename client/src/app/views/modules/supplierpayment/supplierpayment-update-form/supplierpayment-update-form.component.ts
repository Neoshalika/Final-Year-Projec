import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierpayment} from '../../../../entities/supplierpayment';
import {SupplierpaymentService} from '../../../../services/supplierpayment.service';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PurchaseService} from '../../../../services/purchase.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-supplierpayment-update-form',
  templateUrl: './supplierpayment-update-form.component.html',
  styleUrls: ['./supplierpayment-update-form.component.scss']
})
export class SupplierpaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  supplierpayment: Supplierpayment;

  purchases: Purchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  form = new FormGroup({
    purchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    paymentstatus: new FormControl('1', [
      Validators.required,
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.min(0),
      Validators.max(100000000),
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
  });

  get purchaseField(): FormControl{
    return this.form.controls.purchase as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
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
    private purchaseService: PurchaseService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private supplierpaymentService: SupplierpaymentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.purchaseField.disable();
    this.dateField.disable();
    this.amountField.disable();
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
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

    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
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
    this.supplierpayment = await this.supplierpaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.purchaseField.pristine) {
      this.purchaseField.setValue(this.supplierpayment.purchase.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.supplierpayment.date);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.supplierpayment.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.supplierpayment.paymenttype.id);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.supplierpayment.amount);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.supplierpayment.chequeno);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.supplierpayment.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.supplierpayment.chequebranch);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.supplierpayment.chequedate);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.supplierpayment.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newsupplierpayment: Supplierpayment = new Supplierpayment();
    newsupplierpayment.purchase = this.purchaseField.value;
    newsupplierpayment.date = DateHelper.getDateAsString(this.dateField.value);
    newsupplierpayment.paymentstatus = this.paymentstatusField.value;
    newsupplierpayment.paymenttype = this.paymenttypeField.value;
    newsupplierpayment.amount = this.amountField.value;
    newsupplierpayment.chequeno = this.chequenoField.value;
    newsupplierpayment.chequebank = this.chequebankField.value;
    newsupplierpayment.chequebranch = this.chequebranchField.value;
    newsupplierpayment.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newsupplierpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierpaymentService.update(this.selectedId, newsupplierpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierpayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/supplierpayments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
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

  paymentstatuseOptionDisable(paymentstatus: any): boolean {
    if (this.supplierpayment.paymentstatus.id === 1){
      return true;
    }
    if (this.supplierpayment.paymentstatus.id === 2){
      return false;
    }
    if (this.supplierpayment.paymentstatus.id === 3){
      if (paymentstatus.id === 1){
        return true;
      }else if (paymentstatus.id === 2){
        return false;
      }else if (paymentstatus.id === 3){
        return false;
      }
    }
    return  false;
  }
}

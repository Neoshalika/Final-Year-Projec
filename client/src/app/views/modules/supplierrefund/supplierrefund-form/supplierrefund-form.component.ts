import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierrefund} from '../../../../entities/supplierrefund';
import {SupplierrefundService} from '../../../../services/supplierrefund.service';
import {ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {PurchaseService} from '../../../../services/purchase.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {SupplierrefundmaterialSubFormComponent} from './supplierrefundmaterial-sub-form/supplierrefundmaterial-sub-form.component';

@Component({
  selector: 'app-supplierrefund-form',
  templateUrl: './supplierrefund-form.component.html',
  styleUrls: ['./supplierrefund-form.component.scss']
})
export class SupplierrefundFormComponent extends AbstractComponent implements OnInit {

  paymenttypes: Paymenttype[] = [];
  purchases: Purchase[] = [];
  @ViewChild(SupplierrefundmaterialSubFormComponent) supplierrefundmaterialSubForm: SupplierrefundmaterialSubFormComponent;

  form = new FormGroup({
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    purchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000000),
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
    supplierrefundmaterials: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get purchaseField(): FormControl{
    return this.form.controls.purchase as FormControl;
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

  get supplierrefundmaterialsField(): FormControl{
    return this.form.controls.supplierrefundmaterials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private paymenttypeService: PaymenttypeService,
    private purchaseService: PurchaseService,
    private supplierrefundService: SupplierrefundService,
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

    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERREFUND);
  }

  async submit(): Promise<void> {
    this.supplierrefundmaterialSubForm.resetForm();
    this.supplierrefundmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const supplierrefund: Supplierrefund = new Supplierrefund();
    supplierrefund.paymenttype = this.paymenttypeField.value;
    supplierrefund.purchase = this.purchaseField.value;
    supplierrefund.date = DateHelper.getDateAsString(this.dateField.value);
    supplierrefund.amount = this.amountField.value;
    supplierrefund.chequeno = this.chequenoField.value;
    supplierrefund.chequebank = this.chequebankField.value;
    supplierrefund.chequebranch = this.chequebranchField.value;
    supplierrefund.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    supplierrefund.supplierrefundmaterialList = this.supplierrefundmaterialsField.value;
    supplierrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierrefundService.add(supplierrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierrefunds/' + resourceLink.id);
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
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.supplierrefundmaterialList) { this.supplierrefundmaterialsField.setErrors({server: msg.supplierrefundmaterialList}); knownError = true; }
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

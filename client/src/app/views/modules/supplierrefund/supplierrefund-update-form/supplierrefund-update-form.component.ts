import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierrefund} from '../../../../entities/supplierrefund';
import {SupplierrefundService} from '../../../../services/supplierrefund.service';
import {ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PurchaseService} from '../../../../services/purchase.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {SupplierrefundmaterialUpdateSubFormComponent} from './supplierrefundmaterial-update-sub-form/supplierrefundmaterial-update-sub-form.component';

@Component({
  selector: 'app-supplierrefund-update-form',
  templateUrl: './supplierrefund-update-form.component.html',
  styleUrls: ['./supplierrefund-update-form.component.scss']
})
export class SupplierrefundUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  supplierrefund: Supplierrefund;

  paymenttypes: Paymenttype[] = [];
  purchases: Purchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(SupplierrefundmaterialUpdateSubFormComponent) supplierrefundmaterialUpdateSubForm: SupplierrefundmaterialUpdateSubFormComponent;

  form = new FormGroup({
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    purchase: new FormControl(null, [
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

  get supplierrefundmaterialsField(): FormControl{
    return this.form.controls.supplierrefundmaterials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private paymenttypeService: PaymenttypeService,
    private purchaseService: PurchaseService,
    private paymentstatusService: PaymentstatusService,
    private supplierrefundService: SupplierrefundService,
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
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.supplierrefund = await this.supplierrefundService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERREFUND);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.supplierrefund.paymenttype.id);
    }
    if (this.purchaseField.pristine) {
      this.purchaseField.setValue(this.supplierrefund.purchase.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.supplierrefund.paymentstatus.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.supplierrefund.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.supplierrefund.amount);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.supplierrefund.chequeno);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.supplierrefund.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.supplierrefund.chequebranch);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.supplierrefund.chequedate);
    }
    if (this.supplierrefundmaterialsField.pristine) {
      this.supplierrefundmaterialsField.setValue(this.supplierrefund.supplierrefundmaterialList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.supplierrefund.description);
    }
}

  async submit(): Promise<void> {
    this.supplierrefundmaterialUpdateSubForm.resetForm();
    this.supplierrefundmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newsupplierrefund: Supplierrefund = new Supplierrefund();
    newsupplierrefund.paymenttype = this.paymenttypeField.value;
    newsupplierrefund.purchase = this.purchaseField.value;
    newsupplierrefund.paymentstatus = this.paymentstatusField.value;
    newsupplierrefund.date = DateHelper.getDateAsString(this.dateField.value);
    newsupplierrefund.amount = this.amountField.value;
    newsupplierrefund.chequeno = this.chequenoField.value;
    newsupplierrefund.chequebank = this.chequebankField.value;
    newsupplierrefund.chequebranch = this.chequebranchField.value;
    newsupplierrefund.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newsupplierrefund.supplierrefundmaterialList = this.supplierrefundmaterialsField.value;
    newsupplierrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierrefundService.update(this.selectedId, newsupplierrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierrefunds/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/supplierrefunds');
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
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
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

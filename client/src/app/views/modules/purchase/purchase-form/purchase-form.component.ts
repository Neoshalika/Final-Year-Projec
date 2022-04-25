import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Purchase} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {ViewChild} from '@angular/core';
import {Porder} from '../../../../entities/porder';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {PorderService} from '../../../../services/porder.service';
import {SupplierService} from '../../../../services/supplier.service';
import {PurchasematerialSubFormComponent} from './purchasematerial-sub-form/purchasematerial-sub-form.component';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent extends AbstractComponent implements OnInit {

  suppliers: Supplier[] = [];
  porders: Porder[] = [];
  @ViewChild(PurchasematerialSubFormComponent) purchasematerialSubForm: PurchasematerialSubFormComponent;

  form = new FormGroup({
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    porder: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    purchasematerials: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get porderField(): FormControl{
    return this.form.controls.porder as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get purchasematerialsField(): FormControl{
    return this.form.controls.purchasematerials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private porderService: PorderService,
    private purchaseService: PurchaseService,
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

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  async submit(): Promise<void> {
    this.purchasematerialSubForm.resetForm();
    this.purchasematerialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const purchase: Purchase = new Purchase();
    purchase.supplier = this.supplierField.value;
    purchase.porder = this.porderField.value;
    purchase.date = DateHelper.getDateAsString(this.dateField.value);
    purchase.total = this.totalField.value;
    purchase.purchasematerialList = this.purchasematerialsField.value;
    purchase.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseService.add(purchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchases/' + (parseInt(resourceLink.id) + 1));
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
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.porder) { this.porderField.setErrors({server: msg.porder}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.purchasematerialList) { this.purchasematerialsField.setErrors({server: msg.purchasematerialList}); knownError = true; }
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

  async getPorder(): Promise<void> {
    if (this.supplierField.value) {
      this.purchasematerialsField.patchValue([]);
      this.porderField.patchValue(null);
      this.porders = await this.porderService.getAllBySupplier(this.supplierField.value);
    }
  }

  async setValue(): Promise<void> {
    const purchaseOrder: Porder = await this.porderService.get(this.porderField.value);
    this.purchasematerialsField.patchValue(purchaseOrder.pordermaterialList);
  }

  totalCalculatio(): void{
    let total = 0;
    if (this.purchasematerialsField.value !== []){
      const purchasematerials = this.purchasematerialsField.value;
      purchasematerials.forEach(purchasematerial => {
        if (purchasematerial.unitprice !== '' && purchasematerial.unitprice != null){
          total += parseFloat(purchasematerial.unitprice) * parseFloat(purchasematerial.qty);
        }
      });
      this.totalField.patchValue(total);
    }
  }

  dateVaidate(): any{
    return new Date();
  }
}

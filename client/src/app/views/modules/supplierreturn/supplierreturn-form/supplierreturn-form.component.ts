import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierreturn} from '../../../../entities/supplierreturn';
import {SupplierreturnService} from '../../../../services/supplierreturn.service';
import {ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {PurchaseService} from '../../../../services/purchase.service';
import {SupplierreturnmaterialSubFormComponent} from './supplierreturnmaterial-sub-form/supplierreturnmaterial-sub-form.component';

@Component({
  selector: 'app-supplierreturn-form',
  templateUrl: './supplierreturn-form.component.html',
  styleUrls: ['./supplierreturn-form.component.scss']
})
export class SupplierreturnFormComponent extends AbstractComponent implements OnInit {

  purchases: Purchase[] = [];
  @ViewChild(SupplierreturnmaterialSubFormComponent) supplierreturnmaterialSubForm: SupplierreturnmaterialSubFormComponent;

  form = new FormGroup({
    purchase: new FormControl(null, [
    ]),
    doreturned: new FormControl(null, [
      Validators.required,
    ]),
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    supplierreturnmaterials: new FormControl(),
  });

  get purchaseField(): FormControl{
    return this.form.controls.purchase as FormControl;
  }

  get doreturnedField(): FormControl{
    return this.form.controls.doreturned as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get supplierreturnmaterialsField(): FormControl{
    return this.form.controls.supplierreturnmaterials as FormControl;
  }

  constructor(
    private purchaseService: PurchaseService,
    private supplierreturnService: SupplierreturnService,
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

    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }

  async submit(): Promise<void> {
    this.supplierreturnmaterialSubForm.resetForm();
    this.supplierreturnmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const supplierreturn: Supplierreturn = new Supplierreturn();
    supplierreturn.purchase = this.purchaseField.value;
    supplierreturn.doreturned = DateHelper.getDateAsString(this.doreturnedField.value);
    supplierreturn.reason = this.reasonField.value;
    supplierreturn.supplierreturnmaterialList = this.supplierreturnmaterialsField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierreturnService.add(supplierreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierreturns/' + resourceLink.id);
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
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.doreturned) { this.doreturnedField.setErrors({server: msg.doreturned}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.supplierreturnmaterialList) { this.supplierreturnmaterialsField.setErrors({server: msg.supplierreturnmaterialList}); knownError = true; }
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

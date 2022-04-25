import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierreturn} from '../../../../entities/supplierreturn';
import {SupplierreturnService} from '../../../../services/supplierreturn.service';
import {ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {PurchaseService} from '../../../../services/purchase.service';
import {Supplierreturnstatus} from '../../../../entities/supplierreturnstatus';
import {SupplierreturnstatusService} from '../../../../services/supplierreturnstatus.service';
import {SupplierreturnmaterialUpdateSubFormComponent} from './supplierreturnmaterial-update-sub-form/supplierreturnmaterial-update-sub-form.component';

@Component({
  selector: 'app-supplierreturn-update-form',
  templateUrl: './supplierreturn-update-form.component.html',
  styleUrls: ['./supplierreturn-update-form.component.scss']
})
export class SupplierreturnUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  supplierreturn: Supplierreturn;

  purchases: Purchase[] = [];
  supplierreturnstatuses: Supplierreturnstatus[] = [];
  @ViewChild(SupplierreturnmaterialUpdateSubFormComponent) supplierreturnmaterialUpdateSubForm: SupplierreturnmaterialUpdateSubFormComponent;

  form = new FormGroup({
    purchase: new FormControl(null, [
    ]),
    supplierreturnstatus: new FormControl('1', [
    ]),
    doreturned: new FormControl(null, [
      Validators.required,
    ]),
    dorecived: new FormControl(null, [
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

  get supplierreturnstatusField(): FormControl{
    return this.form.controls.supplierreturnstatus as FormControl;
  }

  get doreturnedField(): FormControl{
    return this.form.controls.doreturned as FormControl;
  }

  get dorecivedField(): FormControl{
    return this.form.controls.dorecived as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get supplierreturnmaterialsField(): FormControl{
    return this.form.controls.supplierreturnmaterials as FormControl;
  }

  constructor(
    private purchaseService: PurchaseService,
    private supplierreturnstatusService: SupplierreturnstatusService,
    private supplierreturnService: SupplierreturnService,
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

    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.supplierreturnstatusService.getAll().then((supplierreturnstatuses) => {
      this.supplierreturnstatuses = supplierreturnstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.supplierreturn = await this.supplierreturnService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.purchaseField.pristine) {
      this.purchaseField.setValue(this.supplierreturn.purchase.id);
    }
    if (this.supplierreturnstatusField.pristine) {
      this.supplierreturnstatusField.setValue(this.supplierreturn.supplierreturnstatus.id);
    }
    if (this.doreturnedField.pristine) {
      this.doreturnedField.setValue(this.supplierreturn.doreturned);
    }
    if (this.dorecivedField.pristine) {
      this.dorecivedField.setValue(this.supplierreturn.dorecived);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.supplierreturn.reason);
    }
    if (this.supplierreturnmaterialsField.pristine) {
      this.supplierreturnmaterialsField.setValue(this.supplierreturn.supplierreturnmaterialList);
    }
}

  async submit(): Promise<void> {
    this.supplierreturnmaterialUpdateSubForm.resetForm();
    this.supplierreturnmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newsupplierreturn: Supplierreturn = new Supplierreturn();
    newsupplierreturn.purchase = this.purchaseField.value;
    newsupplierreturn.supplierreturnstatus = this.supplierreturnstatusField.value;
    newsupplierreturn.doreturned = DateHelper.getDateAsString(this.doreturnedField.value);
    newsupplierreturn.dorecived = this.dorecivedField.value ? DateHelper.getDateAsString(this.dorecivedField.value) : null;
    newsupplierreturn.reason = this.reasonField.value;
    newsupplierreturn.supplierreturnmaterialList = this.supplierreturnmaterialsField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierreturnService.update(this.selectedId, newsupplierreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierreturns/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/supplierreturns');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.supplierreturnstatus) { this.supplierreturnstatusField.setErrors({server: msg.supplierreturnstatus}); knownError = true; }
          if (msg.doreturned) { this.doreturnedField.setErrors({server: msg.doreturned}); knownError = true; }
          if (msg.dorecived) { this.dorecivedField.setErrors({server: msg.dorecived}); knownError = true; }
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

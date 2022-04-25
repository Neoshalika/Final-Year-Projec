import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {SupplierService} from '../../../../services/supplier.service';
import {PordermaterialUpdateSubFormComponent} from './pordermaterial-update-sub-form/pordermaterial-update-sub-form.component';

@Component({
  selector: 'app-porder-update-form',
  templateUrl: './porder-update-form.component.html',
  styleUrls: ['./porder-update-form.component.scss']
})
export class PorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  porder: Porder;

  suppliers: Supplier[] = [];
  @ViewChild(PordermaterialUpdateSubFormComponent) pordermaterialUpdateSubForm: PordermaterialUpdateSubFormComponent;

  form = new FormGroup({
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    doordered: new FormControl(null, [
      Validators.required,
    ]),
    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    dorecived: new FormControl(null, [
    ]),
    pordermaterials: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get doorderedField(): FormControl{
    return this.form.controls.doordered as FormControl;
  }

  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get dorecivedField(): FormControl{
    return this.form.controls.dorecived as FormControl;
  }

  get pordermaterialsField(): FormControl{
    return this.form.controls.pordermaterials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private porderService: PorderService,
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

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.porder = await this.porderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.porder.supplier.id);
    }
    if (this.doorderedField.pristine) {
      this.doorderedField.setValue(this.porder.doordered);
    }
    if (this.dorequiredField.pristine) {
      this.dorequiredField.setValue(this.porder.dorequired);
    }
    if (this.dorecivedField.pristine) {
      this.dorecivedField.setValue(this.porder.dorecived);
    }
    if (this.pordermaterialsField.pristine) {
      this.pordermaterialsField.setValue(this.porder.pordermaterialList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.porder.description);
    }
}

  async submit(): Promise<void> {
    this.pordermaterialUpdateSubForm.resetForm();
    this.pordermaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newporder: Porder = new Porder();
    newporder.supplier = this.supplierField.value;
    newporder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    newporder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    newporder.dorecived = this.dorecivedField.value ? DateHelper.getDateAsString(this.dorecivedField.value) : null;
    newporder.pordermaterialList = this.pordermaterialsField.value;
    newporder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.porderService.update(this.selectedId, newporder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/porders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/porders');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.doordered) { this.doorderedField.setErrors({server: msg.doordered}); knownError = true; }
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.dorecived) { this.dorecivedField.setErrors({server: msg.dorecived}); knownError = true; }
          if (msg.pordermaterialList) { this.pordermaterialsField.setErrors({server: msg.pordermaterialList}); knownError = true; }
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

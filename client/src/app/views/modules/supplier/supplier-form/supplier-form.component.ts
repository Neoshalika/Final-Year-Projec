import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Supplier} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';
import {Materialcategory} from '../../../../entities/materialcategory';
import {MaterialcategoryService} from '../../../../services/materialcategory.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent extends AbstractComponent implements OnInit {


  materialcategories: Materialcategory[] = [];

  form = new FormGroup({

    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    contact1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    contact2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    materialcategories: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });


  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get materialcategoriesField(): FormControl{
    return this.form.controls.materialcategories as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private materialcategoryService: MaterialcategoryService,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.materialcategoryService.getAll().then((materialcategories) => {
      this.materialcategories = materialcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{
  this.updatePrivileges();
  }


  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  async submit(): Promise<void> {
    this.materialcategoriesField.updateValueAndValidity();
    this.materialcategoriesField.markAsTouched();
    if (this.form.invalid) { return; }

    const supplier: Supplier = new Supplier();
    supplier.name = this.nameField.value;
    supplier.email = this.emailField.value;
    supplier.fax = this.faxField.value;
    supplier.contact1 = this.contact1Field.value;
    supplier.contact2 = this.contact2Field.value;
    supplier.address = this.addressField.value;
    supplier.materialcategoryList = this.materialcategoriesField.value;
    supplier.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierService.add(supplier);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/suppliers/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.materialcategoryList) { this.materialcategoriesField.setErrors({server: msg.materialcategoryList}); knownError = true; }
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

import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Unit} from '../../../../entities/unit';
import {UnitService} from '../../../../services/unit.service';
import {Materialsubcategory} from '../../../../entities/materialsubcategory';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';
import {MaterialcategoryService} from '../../../../services/materialcategory.service';
import {Materialcategory} from '../../../../entities/materialcategory';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent extends AbstractComponent implements OnInit {

  materialcategories: Materialcategory[] = [];
  materialsubcategories: Materialsubcategory[] = [];
  units: Unit[] = [];

  form = new FormGroup({
    materialcategory: new FormControl(null, [
      Validators.required,
    ]),
    materialsubcategory: new FormControl(null, [
      Validators.required,
    ]),
    unit: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,11}([.][0-9]{1,2})?)$'),
    ]),
    rop: new FormControl(null, [
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    lastprice: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    oneunitprice: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get materialcategoryField(): FormControl{
    return this.form.controls.materialcategory as FormControl;
  }

  get materialsubcategoryField(): FormControl{
    return this.form.controls.materialsubcategory as FormControl;
  }

  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get ropField(): FormControl{
    return this.form.controls.rop as FormControl;
  }

  get lastpriceField(): FormControl{
    return this.form.controls.lastprice as FormControl;
  }

  get oneunitpriceField(): FormControl{
    return this.form.controls.oneunitprice as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private materialsubcategoryService: MaterialsubcategoryService,
    private unitService: UnitService,
    private materialService: MaterialService,
    private snackBar: MatSnackBar,
    private router: Router,
    private materialcategoryService: MaterialcategoryService
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

    this.materialsubcategoryService.getAllBasic(new PageRequest()).then((materialsubcategoryDataPage) => {
      this.materialsubcategories = materialsubcategoryDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.unitService.getAll().then((units) => {
      this.units = units;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialcategoryService.getAll().then((materialcategories) => {
      this.materialcategories = materialcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  onChangeCategory(): void{
    if (this.materialsubcategoryField.value) {
      this.materialsubcategoryField.setValue(null);
    }
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const material: Material = new Material();
    material.materialsubcategory = this.materialsubcategoryField.value;
    material.unit = this.unitField.value;
    material.name = this.nameField.value;
    material.qty = this.qtyField.value;
    material.rop = this.ropField.value;
    material.oneunitprice = this.oneunitpriceField.value;
    material.lastprice = this.lastpriceField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      material.photo = photoIds[0];
    }else{
      material.photo = null;
    }
    material.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.add(material);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
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
          if (msg.materialsubcategory) { this.materialsubcategoryField.setErrors({server: msg.materialsubcategory}); knownError = true; }
          if (msg.unit) { this.unitField.setErrors({server: msg.unit}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.rop) { this.ropField.setErrors({server: msg.rop}); knownError = true; }
          if (msg.oneunitprice) { this.oneunitpriceField.setErrors({server: msg.oneunitprice}); knownError = true; }
          if (msg.lastprice) { this.lastpriceField.setErrors({server: msg.lastprice}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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

  unidByCategory(unit: Unit): boolean {
    if (this.materialcategoryField.value) {
      if (this.materialcategoryField.value === 1) {
        if (unit.id === 1) {
          return false;
        } else if (unit.id === 2) {
          return false;
        } else {
          return true;
        }
      } else if (this.materialcategoryField.value === 2) {
        if (unit.id === 3) {
          return false;
        } else {
          return true;
        }
      } else if (this.materialcategoryField.value === 3) {
        if (unit.id === 1) {
          return false;
        } else if (unit.id === 2) {
          return false;
        } else if (unit.id === 4) {
          return false;
        } else if (unit.id === 6) {
          return false;
        } else {
          return true;
        }
      } else if (this.materialcategoryField.value === 4) {
        if (unit.id === 1) {
          return false;
        } else if (unit.id === 2) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
}

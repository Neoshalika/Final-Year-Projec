import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Unit} from '../../../../entities/unit';
import {UnitService} from '../../../../services/unit.service';
import {Materialstatus} from '../../../../entities/materialstatus';
import {Materialsubcategory} from '../../../../entities/materialsubcategory';
import {MaterialstatusService} from '../../../../services/materialstatus.service';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';

@Component({
  selector: 'app-material-update-form',
  templateUrl: './material-update-form.component.html',
  styleUrls: ['./material-update-form.component.scss']
})
export class MaterialUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  material: Material;

  materialsubcategories: Materialsubcategory[] = [];
  units: Unit[] = [];
  materialstatuses: Materialstatus[] = [];

  form = new FormGroup({
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
      Validators.pattern('^[a-zA-Z ]{3,}$'),
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
    materialstatus: new FormControl('1', [
      Validators.required,
    ]),
    more: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

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

  get materialstatusField(): FormControl{
    return this.form.controls.materialstatus as FormControl;
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
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
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
    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.material = await this.materialService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.materialsubcategoryField.pristine) {
      this.materialsubcategoryField.setValue(this.material.materialsubcategory.id);
    }
    if (this.unitField.pristine) {
      this.unitField.setValue(this.material.unit.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.material.name);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.material.qty);
    }
    if (this.ropField.pristine) {
      this.ropField.setValue(this.material.rop);
    }
    if (this.lastpriceField.pristine) {
      this.lastpriceField.setValue(this.material.lastprice);
    }
    if (this.materialstatusField.pristine) {
      this.materialstatusField.setValue(this.material.materialstatus.id);
    }
    if (this.photoField.pristine) {
      if (this.material.photo) { this.photoField.setValue([this.material.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.material.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newmaterial: Material = new Material();
    newmaterial.materialsubcategory = this.materialsubcategoryField.value;
    newmaterial.unit = this.unitField.value;
    newmaterial.name = this.nameField.value;
    newmaterial.qty = this.qtyField.value;
    newmaterial.rop = this.ropField.value;
    newmaterial.lastprice = this.lastpriceField.value;
    newmaterial.materialstatus = this.materialstatusField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newmaterial.photo = photoIds[0];
    }else{
      newmaterial.photo = null;
    }
    newmaterial.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.update(this.selectedId, newmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materials');
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
          if (msg.lastprice) { this.lastpriceField.setErrors({server: msg.lastprice}); knownError = true; }
          if (msg.materialstatus) { this.materialstatusField.setErrors({server: msg.materialstatus}); knownError = true; }
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
}

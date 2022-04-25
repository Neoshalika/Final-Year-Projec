import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Product} from '../../../../entities/product';
import {ProductService} from '../../../../services/product.service';
import {ViewChild} from '@angular/core';
import {Productstatus} from '../../../../entities/productstatus';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {ProductmaterialUpdateSubFormComponent} from './productmaterial-update-sub-form/productmaterial-update-sub-form.component';
import {Productsubcategory} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';

@Component({
  selector: 'app-product-update-form',
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.scss']
})
export class ProductUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  product: Product;

  productstatuses: Productstatus[] = [];
  productsubcategories: Productsubcategory[] = [];
  @ViewChild(ProductmaterialUpdateSubFormComponent) productmaterialUpdateSubForm: ProductmaterialUpdateSubFormComponent;

  form = new FormGroup({
    productsubcategory: new FormControl(null, [
      Validators.required
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    productstatus: new FormControl('1', [
    ]),
    photo: new FormControl(),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    unitprice: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    rpqty: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    productmaterials: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get productsubcategoryField(): FormControl{
    return this.form.controls.productsubcategory as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get productstatusField(): FormControl{
    return this.form.controls.productstatus as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get rpqtyField(): FormControl{
    return this.form.controls.rpqty as FormControl;
  }

  get productmaterialsField(): FormControl{
    return this.form.controls.productmaterials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private productstatusService: ProductstatusService,
    private productsubcategoryService: ProductsubcategoryService,
    private productService: ProductService,
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

    this.productstatusService.getAll().then((productstatuses) => {
      this.productstatuses = productstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productsubcategoryService.getAll(new PageRequest()).then((productsubcategories) => {
      this.productsubcategories = productsubcategories.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.product = await this.productService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.product.name);
    }
    if (this.productstatusField.pristine) {
      this.productstatusField.setValue(this.product.productstatus.id);
    }
    if (this.photoField.pristine) {
      if (this.product.photo) { this.photoField.setValue([this.product.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.product.qty);
    }
    if (this.unitpriceField.pristine) {
      this.unitpriceField.setValue(this.product.unitprice);
    }
    if (this.rpqtyField.pristine) {
      this.rpqtyField.setValue(this.product.rpqty);
    }
    if (this.productmaterialsField.pristine) {
      this.productmaterialsField.setValue(this.product.productmaterialList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.product.description);
    }
    if (this.productsubcategoryField.pristine) {
      this.productsubcategoryField.setValue(this.product.productsubcategory.id);
    }
}


  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.productmaterialUpdateSubForm.resetForm();
    this.productmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newproduct: Product = new Product();
    newproduct.name = this.nameField.value;
    newproduct.productstatus = this.productstatusField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newproduct.photo = photoIds[0];
    }else{
      newproduct.photo = null;
    }
    newproduct.qty = this.qtyField.value;
    newproduct.productsubcategory = this.productsubcategoryField.value;
    newproduct.unitprice = this.unitpriceField.value;
    newproduct.rpqty = this.rpqtyField.value;
    newproduct.productmaterialList = this.productmaterialsField.value;
    newproduct.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.productService.update(this.selectedId, newproduct);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/products');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.productstatus) { this.productstatusField.setErrors({server: msg.productstatus}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.unitprice) { this.unitpriceField.setErrors({server: msg.unitprice}); knownError = true; }
          if (msg.rpqty) { this.rpqtyField.setErrors({server: msg.rpqty}); knownError = true; }
          if (msg.productmaterialList) { this.productmaterialsField.setErrors({server: msg.productmaterialList}); knownError = true; }
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

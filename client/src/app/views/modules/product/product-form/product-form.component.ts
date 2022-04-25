import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Product} from '../../../../entities/product';
import {ProductService} from '../../../../services/product.service';
import {ViewChild} from '@angular/core';
import {ProductmaterialSubFormComponent} from './productmaterial-sub-form/productmaterial-sub-form.component';
import {ProductcategoryService} from '../../../../services/productcategory.service';
import {Productsubcategory} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';
import {Productcategory} from '../../../../entities/productcategory';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends AbstractComponent implements OnInit {

  productsubcategories: Productsubcategory[] = [];
  productcategories: Productcategory[] = [];
  @ViewChild(ProductmaterialSubFormComponent) productmaterialSubForm: ProductmaterialSubFormComponent;

  form = new FormGroup({
    productcategory: new FormControl(null, [
      Validators.required
    ]),
    productsubcategory: new FormControl(null, [
      Validators.required
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
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

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
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

  get productcategoryField(): FormControl{
    return this.form.controls.productcategory as FormControl;
  }

  get productsubcategoryField(): FormControl{
    return this.form.controls.productsubcategory as FormControl;
  }

  constructor(
    private productService: ProductService,
    private productcategoryService: ProductcategoryService,
    private productsubcategoryService: ProductsubcategoryService,
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

    this.productcategoryService.getAll().then((productsubcategoryes) => {
      this.productcategories = productsubcategoryes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.productmaterialSubForm.resetForm();
    this.productmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const product: Product = new Product();
    product.name = this.nameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      product.photo = photoIds[0];
    }else{
      product.photo = null;
    }
    product.qty = this.qtyField.value;
    product.unitprice = this.unitpriceField.value;
    product.rpqty = this.rpqtyField.value;
    product.productsubcategory = this.productsubcategoryField.value;
    product.productmaterialList = this.productmaterialsField.value;
    product.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.productService.add(product);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
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
  lodsubcat(): void{
    this.productsubcategoryService.getAllByCategory(this.productcategoryField.value).then((productsubcategories) => {
      this.productsubcategories = productsubcategories;
      this.productcategoryField.disable();
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }
}

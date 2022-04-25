import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Customerorderproduct} from '../../../../../entities/customerorderproduct';
import {Product} from '../../../../../entities/product';
import {ProductService} from '../../../../../services/product.service';
import {ProductcategoryService} from '../../../../../services/productcategory.service';
import {ProductsubcategoryService} from '../../../../../services/productsubcategory.service';
import {Productcategory} from '../../../../../entities/productcategory';
import {Productsubcategory} from '../../../../../entities/productsubcategory';

@Component({
  selector: 'app-customerorderproduct-sub-form',
  templateUrl: './customerorderproduct-sub-form.component.html',
  styleUrls: ['./customerorderproduct-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerorderproductSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomerorderproductSubFormComponent),
      multi: true,
    }
  ]
})
export class CustomerorderproductSubFormComponent extends AbstractSubFormComponent<Customerorderproduct> implements OnInit{

  products: Product[] = [];
  productcategories: Productcategory[] = [];
  productsubcategories: Productsubcategory[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    category: new FormControl(null),
    subcategory: new FormControl(null),
    product: new FormControl(),
    qty: new FormControl(),
    unitprice: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get categoryField(): FormControl{
    return this.form.controls.category as FormControl;
  }

  get subcategoryField(): FormControl{
    return this.form.controls.subcategory as FormControl;
  }

  get productField(): FormControl{
    return this.form.controls.product as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.productField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.unitpriceField);
  }

  constructor(
    private productService: ProductService,
    private productcategoryService: ProductcategoryService,
    private productsubcategoryService: ProductsubcategoryService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.productcategoryService.getAll().then((productDataPage) => {
      this.productcategories = productDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.productField.setValidators([Validators.required]);
    this.categoryField.setValidators([Validators.required]);
    this.subcategoryField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
      Validators.max(1000000),
      Validators.min(0),
    ]);
    this.unitpriceField.setValidators([
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
      Validators.max(1000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.productField.clearValidators();
    this.categoryField.clearValidators();
    this.subcategoryField.clearValidators();
    this.qtyField.clearValidators();
    this.unitpriceField.clearValidators();
  }

  fillForm(dataItem: Customerorderproduct): void {
    this.idField.patchValue(dataItem.id);
    this.productField.patchValue(dataItem.product.id);
    this.qtyField.patchValue(dataItem.qty);
    this.unitpriceField.patchValue(dataItem.unitprice);
  }

  resetForm(): void{
    this.categoryField.enable();
    this.subcategoryField.enable();
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(customerorderproduct: Customerorderproduct): string {
    return 'Are you sure to remove \u201C ' + customerorderproduct.product.name + ' \u201D from customer order product?';
  }

  getUpdateConfirmMessage(customerorderproduct: Customerorderproduct): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + customerorderproduct.product.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + customerorderproduct.product.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Customerorderproduct = new Customerorderproduct();
    dataItem.id = this.idField.value;

    for (const product of this.products){
      if (this.productField.value === product.id) {
        dataItem.product = product;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    dataItem.unitprice = this.unitpriceField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }


  lodsubcat(): void{
    this.productsubcategoryService.getAllByCategory(this.categoryField.value).then((productsubcategories) => {
      this.productsubcategories = productsubcategories;
      this.categoryField.disable();
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  loadProduct(): void{
    this.productService.getAllBySubCat(this.subcategoryField.value).then((productDataPage) => {
      this.products = productDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setAmount(product: Product): void {
    this.unitpriceField.patchValue(product.unitprice);
  }
}

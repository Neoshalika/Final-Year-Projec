import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Customorderrefunditem} from '../../../../../entities/customorderrefunditem';

@Component({
  selector: 'app-customorderrefunditem-sub-form',
  templateUrl: './customorderrefunditem-sub-form.component.html',
  styleUrls: ['./customorderrefunditem-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomorderrefunditemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomorderrefunditemSubFormComponent),
      multi: true,
    }
  ]
})
export class CustomorderrefunditemSubFormComponent extends AbstractSubFormComponent<Customorderrefunditem> implements OnInit{


  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(),
    qty: new FormControl(),
    unitprice: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.nameField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.unitpriceField);
  }

  constructor(
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
  }

  setValidations(): void{
    this.hasValidations = true;
    this.nameField.setValidators([
      Validators.required,
      Validators.pattern('^[a-zA-Z ]{3,}$'),
      Validators.maxLength(255),
    ]);
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
    this.nameField.clearValidators();
    this.qtyField.clearValidators();
    this.unitpriceField.clearValidators();
  }

  fillForm(dataItem: Customorderrefunditem): void {
    this.idField.patchValue(dataItem.id);
    this.nameField.patchValue(dataItem.name);
    this.qtyField.patchValue(dataItem.qty);
    this.unitpriceField.patchValue(dataItem.unitprice);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(customorderrefunditem: Customorderrefunditem): string {
    return 'Are you sure to remove \u201C ' + customorderrefunditem.name + ' \u201D from custom order refund item?';
  }

  getUpdateConfirmMessage(customorderrefunditem: Customorderrefunditem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + customorderrefunditem.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + customorderrefunditem.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Customorderrefunditem = new Customorderrefunditem();
    dataItem.id = this.idField.value;
    dataItem.name = this.nameField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.unitprice = this.unitpriceField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}

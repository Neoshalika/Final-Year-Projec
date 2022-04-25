import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Supplierreturnmaterial} from '../../../../../entities/supplierreturnmaterial';
import {Material} from '../../../../../entities/material';
import {MaterialService} from '../../../../../services/material.service';

@Component({
  selector: 'app-supplierreturnmaterial-update-sub-form',
  templateUrl: './supplierreturnmaterial-update-sub-form.component.html',
  styleUrls: ['./supplierreturnmaterial-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SupplierreturnmaterialUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SupplierreturnmaterialUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class SupplierreturnmaterialUpdateSubFormComponent extends AbstractSubFormComponent<Supplierreturnmaterial> implements OnInit{

  materials: Material[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    material: new FormControl(),
    qty: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.materialField)
      &&   this.isEmptyField(this.qtyField);
  }

  constructor(
    private materialService: MaterialService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.materialField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
      Validators.max(100000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.materialField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Supplierreturnmaterial): void {
    this.idField.patchValue(dataItem.id);
    this.materialField.patchValue(dataItem.material.id);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(supplierreturnmaterial: Supplierreturnmaterial): string {
    return 'Are you sure to remove \u201C ' + supplierreturnmaterial.material.name + ' \u201D from supplier return material?';
  }

  getUpdateConfirmMessage(supplierreturnmaterial: Supplierreturnmaterial): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + supplierreturnmaterial.material.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + supplierreturnmaterial.material.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Supplierreturnmaterial = new Supplierreturnmaterial();
    dataItem.id = this.idField.value;

    for (const material of this.materials){
      if (this.materialField.value === material.id) {
        dataItem.material = material;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Salaryloan} from '../../../../../entities/salaryloan';
import {Loan} from '../../../../../entities/loan';
import {LoanService} from '../../../../../services/loan.service';

@Component({
  selector: 'app-salaryloan-sub-form',
  templateUrl: './salaryloan-sub-form.component.html',
  styleUrls: ['./salaryloan-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalaryloanSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SalaryloanSubFormComponent),
      multi: true,
    }
  ]
})
export class SalaryloanSubFormComponent extends AbstractSubFormComponent<Salaryloan> implements OnInit{

  loans: Loan[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    loan: new FormControl(),
    amount: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get loanField(): FormControl{
    return this.form.controls.loan as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.loanField)
      &&   this.isEmptyField(this.amountField);
  }

  constructor(
    private loanService: LoanService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.loanService.getAllBasic(new PageRequest()).then((loanDataPage) => {
      this.loans = loanDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.loanField.setValidators([Validators.required]);
    this.amountField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
      Validators.max(100000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.loanField.clearValidators();
    this.amountField.clearValidators();
  }

  fillForm(dataItem: Salaryloan): void {
    this.idField.patchValue(dataItem.id);
    this.loanField.patchValue(dataItem.loan.id);
    this.amountField.patchValue(dataItem.amount);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(salaryloan: Salaryloan): string {
    return 'Are you sure to remove \u201C ' + salaryloan.amount + ' \u201D from salary loan?';
  }

  getUpdateConfirmMessage(salaryloan: Salaryloan): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + salaryloan.amount + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + salaryloan.amount + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Salaryloan = new Salaryloan();
    dataItem.id = this.idField.value;

    for (const loan of this.loans){
      if (this.loanField.value === loan.id) {
        dataItem.loan = loan;
        break;
      }
    }

    dataItem.amount = this.amountField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}

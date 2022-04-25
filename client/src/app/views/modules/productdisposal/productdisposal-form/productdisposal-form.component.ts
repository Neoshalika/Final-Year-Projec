import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Productdisposal} from '../../../../entities/productdisposal';
import {ProductdisposalService} from '../../../../services/productdisposal.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {ProductdisposalproductSubFormComponent} from './productdisposalproduct-sub-form/productdisposalproduct-sub-form.component';

@Component({
  selector: 'app-productdisposal-form',
  templateUrl: './productdisposal-form.component.html',
  styleUrls: ['./productdisposal-form.component.scss']
})
export class ProductdisposalFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(ProductdisposalproductSubFormComponent) productdisposalproductSubForm: ProductdisposalproductSubFormComponent;

  form = new FormGroup({
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    productdisposalproducts: new FormControl(),
  });

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get productdisposalproductsField(): FormControl{
    return this.form.controls.productdisposalproducts as FormControl;
  }

  constructor(
    private productdisposalService: ProductdisposalService,
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

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTDISPOSAL);
  }

  async submit(): Promise<void> {
    this.productdisposalproductSubForm.resetForm();
    this.productdisposalproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const productdisposal: Productdisposal = new Productdisposal();
    productdisposal.reason = this.reasonField.value;
    productdisposal.date = DateHelper.getDateAsString(this.dateField.value);
    productdisposal.productdisposalproductList = this.productdisposalproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.productdisposalService.add(productdisposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/productdisposals/' + resourceLink.id);
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
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.productdisposalproductList) { this.productdisposalproductsField.setErrors({server: msg.productdisposalproductList}); knownError = true; }
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

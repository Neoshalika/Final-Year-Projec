import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Productdisposal} from '../../../../entities/productdisposal';
import {ProductdisposalService} from '../../../../services/productdisposal.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {ProductdisposalproductUpdateSubFormComponent} from './productdisposalproduct-update-sub-form/productdisposalproduct-update-sub-form.component';

@Component({
  selector: 'app-productdisposal-update-form',
  templateUrl: './productdisposal-update-form.component.html',
  styleUrls: ['./productdisposal-update-form.component.scss']
})
export class ProductdisposalUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  productdisposal: Productdisposal;

  @ViewChild(ProductdisposalproductUpdateSubFormComponent) productdisposalproductUpdateSubForm: ProductdisposalproductUpdateSubFormComponent;

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

    this.productdisposal = await this.productdisposalService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTDISPOSAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.productdisposal.reason);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.productdisposal.date);
    }
    if (this.productdisposalproductsField.pristine) {
      this.productdisposalproductsField.setValue(this.productdisposal.productdisposalproductList);
    }
}

  async submit(): Promise<void> {
    this.productdisposalproductUpdateSubForm.resetForm();
    this.productdisposalproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newproductdisposal: Productdisposal = new Productdisposal();
    newproductdisposal.reason = this.reasonField.value;
    newproductdisposal.date = DateHelper.getDateAsString(this.dateField.value);
    newproductdisposal.productdisposalproductList = this.productdisposalproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.productdisposalService.update(this.selectedId, newproductdisposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/productdisposals/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/productdisposals');
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

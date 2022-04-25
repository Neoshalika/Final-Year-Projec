import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {ViewChild} from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {DateHelper} from '../../../../shared/date-helper';
import {CustomerService} from '../../../../services/customer.service';
import {CustomerorderproductSubFormComponent} from './customerorderproduct-sub-form/customerorderproduct-sub-form.component';

@Component({
  selector: 'app-customerorder-form',
  templateUrl: './customerorder-form.component.html',
  styleUrls: ['./customerorder-form.component.scss']
})
export class CustomerorderFormComponent extends AbstractComponent implements OnInit {

  customers: Customer[] = [];
  @ViewChild(CustomerorderproductSubFormComponent) customerorderproductSubForm: CustomerorderproductSubFormComponent;

  form = new FormGroup({
    customer: new FormControl(null, [
      Validators.required,
    ]),
    doordered: new FormControl(null, [
      Validators.required,
    ]),
    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    discount: new FormControl(null, [
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    deliverycost: new FormControl(null, [
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    balance: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    customerorderproducts: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }

  get doorderedField(): FormControl{
    return this.form.controls.doordered as FormControl;
  }

  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get discountField(): FormControl{
    return this.form.controls.discount as FormControl;
  }

  get deliverycostField(): FormControl{
    return this.form.controls.deliverycost as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get customerorderproductsField(): FormControl{
    return this.form.controls.customerorderproducts as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private customerService: CustomerService,
    private customerorderService: CustomerorderService,
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
    this.totalField.disable();
    this.balanceField.disable();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERORDER);
  }

  async submit(): Promise<void> {
    this.customerorderproductSubForm.resetForm();
    this.customerorderproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const customerorder: Customerorder = new Customerorder();
    customerorder.customer = this.customerField.value;
    customerorder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    customerorder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    customerorder.discount = this.discountField.value;
    customerorder.deliverycost = this.deliverycostField.value;
    customerorder.total = this.totalField.value;
    customerorder.balance = this.balanceField.value;
    customerorder.customerorderproductList = this.customerorderproductsField.value;
    customerorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerorderService.add(customerorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerorders/' + resourceLink.id);
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
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (msg.doordered) { this.doorderedField.setErrors({server: msg.doordered}); knownError = true; }
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.discount) { this.discountField.setErrors({server: msg.discount}); knownError = true; }
          if (msg.deliverycost) { this.deliverycostField.setErrors({server: msg.deliverycost}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.balance) { this.balanceField.setErrors({server: msg.balance}); knownError = true; }
          if (msg.customerorderproductList) { this.customerorderproductsField.setErrors({server: msg.customerorderproductList}); knownError = true; }
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

  calculateTotal(): void{
    let total = 0;
    let totalWithoutdiscount = 0;
    if (this.customerorderproductsField.value){
      // add line totals to total
      this.customerorderproductsField.value.forEach(customerorderproduct => {
        // get data foor amount field
        total += (customerorderproduct.qty * customerorderproduct.unitprice);
        // get data foor total field
        totalWithoutdiscount += (customerorderproduct.qty * customerorderproduct.unitprice);

      });



      if (this.discountField.value){
// reduce discount
        total -= (total / 100) * this.discountField.value;
      }
      // then add dilivarty cost to total
      if (this.deliverycostField.value){
        totalWithoutdiscount += this.deliverycostField.value;
        total += this.deliverycostField.value;
      }
      this.totalField.patchValue(totalWithoutdiscount);
      this.balanceField.patchValue(total);
    }
  }
  dateVAidation(): any{
    return new Date();
  }
}

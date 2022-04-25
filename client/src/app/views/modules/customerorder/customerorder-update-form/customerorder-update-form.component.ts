import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {ViewChild} from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {DateHelper} from '../../../../shared/date-helper';
import {CustomerService} from '../../../../services/customer.service';
import {Customerorderstatus} from '../../../../entities/customerorderstatus';
import {CustomerorderstatusService} from '../../../../services/customerorderstatus.service';
import {CustomerorderproductUpdateSubFormComponent} from './customerorderproduct-update-sub-form/customerorderproduct-update-sub-form.component';

@Component({
  selector: 'app-customerorder-update-form',
  templateUrl: './customerorder-update-form.component.html',
  styleUrls: ['./customerorder-update-form.component.scss']
})
export class CustomerorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customerorder: Customerorder;

  customers: Customer[] = [];
  customerorderstatuses: Customerorderstatus[] = [];
  @ViewChild(CustomerorderproductUpdateSubFormComponent) customerorderproductUpdateSubForm: CustomerorderproductUpdateSubFormComponent;

  form = new FormGroup({
    customer: new FormControl(null, [
      Validators.required,
    ]),
    customerorderstatus: new FormControl('1', [
      Validators.required,
    ]),
    doordered: new FormControl(null, [
      Validators.required,
    ]),
    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    dofinished: new FormControl(null, [
    ]),
    dohandovered: new FormControl(null, [
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

  get customerorderstatusField(): FormControl{
    return this.form.controls.customerorderstatus as FormControl;
  }

  get doorderedField(): FormControl{
    return this.form.controls.doordered as FormControl;
  }

  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get dofinishedField(): FormControl{
    return this.form.controls.dofinished as FormControl;
  }

  get dohandoveredField(): FormControl{
    return this.form.controls.dohandovered as FormControl;
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
    private customerorderstatusService: CustomerorderstatusService,
    private customerorderService: CustomerorderService,
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

    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerorderstatusService.getAll().then((customerorderstatuses) => {
      this.customerorderstatuses = customerorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerorder = await this.customerorderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.customerField.pristine) {
      this.customerField.setValue(this.customerorder.customer.id);
    }
    if (this.customerorderstatusField.pristine) {
      this.customerorderstatusField.setValue(this.customerorder.customerorderstatus.id);
    }
    if (this.doorderedField.pristine) {
      this.doorderedField.setValue(this.customerorder.doordered);
    }
    if (this.dorequiredField.pristine) {
      this.dorequiredField.setValue(this.customerorder.dorequired);
    }
    if (this.dofinishedField.pristine) {
      this.dofinishedField.setValue(this.customerorder.dofinished);
    }
    if (this.dohandoveredField.pristine) {
      this.dohandoveredField.setValue(this.customerorder.dohandovered);
    }
    if (this.discountField.pristine) {
      this.discountField.setValue(this.customerorder.discount);
    }
    if (this.deliverycostField.pristine) {
      this.deliverycostField.setValue(this.customerorder.deliverycost);
    }
    if (this.totalField.pristine) {
      this.totalField.setValue(this.customerorder.total);
    }
    if (this.balanceField.pristine) {
      this.balanceField.setValue(this.customerorder.balance);
    }
    if (this.customerorderproductsField.pristine) {
      this.customerorderproductsField.setValue(this.customerorder.customerorderproductList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customerorder.description);
    }
}

  async submit(): Promise<void> {
    this.customerorderproductUpdateSubForm.resetForm();
    this.customerorderproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newcustomerorder: Customerorder = new Customerorder();
    newcustomerorder.customer = this.customerField.value;
    newcustomerorder.customerorderstatus = this.customerorderstatusField.value;
    newcustomerorder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    newcustomerorder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    newcustomerorder.dofinished = this.dofinishedField.value ? DateHelper.getDateAsString(this.dofinishedField.value) : null;
    newcustomerorder.dohandovered = this.dohandoveredField.value ? DateHelper.getDateAsString(this.dohandoveredField.value) : null;
    newcustomerorder.discount = this.discountField.value;
    newcustomerorder.deliverycost = this.deliverycostField.value;
    newcustomerorder.total = this.totalField.value;
    newcustomerorder.balance = this.balanceField.value;
    newcustomerorder.customerorderproductList = this.customerorderproductsField.value;
    newcustomerorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerorderService.update(this.selectedId, newcustomerorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerorders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customerorders');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (msg.customerorderstatus) { this.customerorderstatusField.setErrors({server: msg.customerorderstatus}); knownError = true; }
          if (msg.doordered) { this.doorderedField.setErrors({server: msg.doordered}); knownError = true; }
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.dofinished) { this.dofinishedField.setErrors({server: msg.dofinished}); knownError = true; }
          if (msg.dohandovered) { this.dohandoveredField.setErrors({server: msg.dohandovered}); knownError = true; }
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
}

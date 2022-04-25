import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customorderitem} from '../../../../entities/customorderitem';
import {CustomorderitemService} from '../../../../services/customorderitem.service';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';

@Component({
  selector: 'app-customorderitem-form',
  templateUrl: './customorderitem-form.component.html',
  styleUrls: ['./customorderitem-form.component.scss']
})
export class CustomorderitemFormComponent extends AbstractComponent implements OnInit {

  customerorders: Customerorder[] = [];

  form = new FormGroup({
    customerorder: new FormControl(null, [
      Validators.required,
    ]),
    qty: new FormControl(null, [
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    unitprice: new FormControl(null, [
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    document: new FormControl(),
  });

  get customerorderField(): FormControl{
    return this.form.controls.customerorder as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get documentField(): FormControl{
    return this.form.controls.document as FormControl;
  }

  constructor(
    private customerorderService: CustomerorderService,
    private customorderitemService: CustomorderitemService,
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

    this.customerorderService.getAllForcustomOrderItem().then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMORDERITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMORDERITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMORDERITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMORDERITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMORDERITEM);
  }

  async submit(): Promise<void> {
    this.documentField.updateValueAndValidity();
    this.documentField.markAsTouched();
    if (this.form.invalid) { return; }

    const customorderitem: Customorderitem = new Customorderitem();
    customorderitem.customerorder = this.customerorderField.value;
    customorderitem.qty = this.qtyField.value;
    customorderitem.unitprice = this.unitpriceField.value;
    customorderitem.name = this.nameField.value;
    const documentIds = this.documentField.value;
    if (documentIds !== null && documentIds !== []){
      customorderitem.document = documentIds[0];
    }else{
      customorderitem.document = null;
    }
    try{
      const resourceLink: ResourceLink = await this.customorderitemService.add(customorderitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customorderitems/' + resourceLink.id);
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
          if (msg.customerorder) { this.customerorderField.setErrors({server: msg.customerorder}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.unitprice) { this.unitpriceField.setErrors({server: msg.unitprice}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.document) { this.documentField.setErrors({server: msg.document}); knownError = true; }
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

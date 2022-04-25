import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Customorderitem} from '../../../../entities/customorderitem';
import {CustomorderitemService} from '../../../../services/customorderitem.service';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';

@Component({
  selector: 'app-customorderitem-update-form',
  templateUrl: './customorderitem-update-form.component.html',
  styleUrls: ['./customorderitem-update-form.component.scss']
})
export class CustomorderitemUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customorderitem: Customorderitem;

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
    this.customerorderField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.customerorderService.getAllBasic(new PageRequest()).then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customorderitem = await this.customorderitemService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMORDERITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMORDERITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMORDERITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMORDERITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMORDERITEM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.customerorderField.pristine) {
      this.customerorderField.setValue(this.customorderitem.customerorder.id);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.customorderitem.qty);
    }
    if (this.unitpriceField.pristine) {
      this.unitpriceField.setValue(this.customorderitem.unitprice);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.customorderitem.name);
    }
    if (this.documentField.pristine) {
      if (this.customorderitem.document) { this.documentField.setValue([this.customorderitem.document]); }
      else { this.documentField.setValue([]); }
    }
}

  async submit(): Promise<void> {
    this.documentField.updateValueAndValidity();
    this.documentField.markAsTouched();
    if (this.form.invalid) { return; }

    const newcustomorderitem: Customorderitem = new Customorderitem();
    newcustomorderitem.customerorder = this.customerorderField.value;
    newcustomorderitem.qty = this.qtyField.value;
    newcustomorderitem.unitprice = this.unitpriceField.value;
    newcustomorderitem.name = this.nameField.value;
    const documentIds = this.documentField.value;
    if (documentIds !== null && documentIds !== []){
      newcustomorderitem.document = documentIds[0];
    }else{
      newcustomorderitem.document = null;
    }
    try{
      const resourceLink: ResourceLink = await this.customorderitemService.update(this.selectedId, newcustomorderitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customorderitems/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customorderitems');
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

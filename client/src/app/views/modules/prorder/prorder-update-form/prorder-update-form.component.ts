import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Prorder} from '../../../../entities/prorder';
import {ProrderService} from '../../../../services/prorder.service';
import {ViewChild} from '@angular/core';
import {Product} from '../../../../entities/product';
import {DateHelper} from '../../../../shared/date-helper';
import {Prorderstatus} from '../../../../entities/prorderstatus';
import {ProductService} from '../../../../services/product.service';
import {Customorderitem} from '../../../../entities/customorderitem';
import {ProrderstatusService} from '../../../../services/prorderstatus.service';
import {CustomorderitemService} from '../../../../services/customorderitem.service';
import {PrordermaterialUpdateSubFormComponent} from './prordermaterial-update-sub-form/prordermaterial-update-sub-form.component';
import {ProrderemployeeUpdateSubFormComponent} from './prorderemployee-update-sub-form/prorderemployee-update-sub-form.component';

@Component({
  selector: 'app-prorder-update-form',
  templateUrl: './prorder-update-form.component.html',
  styleUrls: ['./prorder-update-form.component.scss']
})
export class ProrderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  prorder: Prorder;

  customorderitems: Customorderitem[] = [];
  products: Product[] = [];
  prorderstatuses: Prorderstatus[] = [];
  @ViewChild(PrordermaterialUpdateSubFormComponent) prordermaterialUpdateSubForm: PrordermaterialUpdateSubFormComponent;
  @ViewChild(ProrderemployeeUpdateSubFormComponent) prorderemployeeUpdateSubForm: ProrderemployeeUpdateSubFormComponent;

  form = new FormGroup({
    customorderitem: new FormControl(null, [
    ]),
    product: new FormControl(null, [
    ]),
    qty: new FormControl(null, [
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern('^([0-9]*)$'),
    ]),
    dostart: new FormControl(null, [
      Validators.required,
    ]),
    deadline: new FormControl(null, [
    ]),
    doend: new FormControl(null, [
    ]),
    prorderstatus: new FormControl('1', [
    ]),
    prordermaterials: new FormControl(),
    prorderemployees: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get customorderitemField(): FormControl{
    return this.form.controls.customorderitem as FormControl;
  }

  get productField(): FormControl{
    return this.form.controls.product as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get dostartField(): FormControl{
    return this.form.controls.dostart as FormControl;
  }

  get deadlineField(): FormControl{
    return this.form.controls.deadline as FormControl;
  }

  get doendField(): FormControl{
    return this.form.controls.doend as FormControl;
  }

  get prorderstatusField(): FormControl{
    return this.form.controls.prorderstatus as FormControl;
  }

  get prordermaterialsField(): FormControl{
    return this.form.controls.prordermaterials as FormControl;
  }

  get prorderemployeesField(): FormControl{
    return this.form.controls.prorderemployees as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private customorderitemService: CustomorderitemService,
    private productService: ProductService,
    private prorderstatusService: ProrderstatusService,
    private prorderService: ProrderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.prorderstatusService.getAll().then((prorderstatuses) => {
      this.prorderstatuses = prorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.customorderitemService.getAllBasic(new PageRequest()).then((customorderitemDataPage) => {
      this.customorderitems = customorderitemDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productService.getAllBasic(new PageRequest()).then((productDataPage) => {
      this.products = productDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.prorder = await this.prorderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.customorderitemField.pristine) {
      if (this.prorder.customorderitem){
        this.customorderitemField.setValue(this.prorder.customorderitem.id);
      }
    }
    if (this.productField.pristine) {
      if (this.prorder.product){
        this.productField.setValue(this.prorder.product.id);
      }
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.prorder.qty);
    }
    if (this.dostartField.pristine) {
      this.dostartField.setValue(this.prorder.dostart);
    }
    if (this.deadlineField.pristine) {
      this.deadlineField.setValue(this.prorder.deadline);
    }
    if (this.doendField.pristine) {
      this.doendField.setValue(this.prorder.doend);
    }
    if (this.prorderstatusField.pristine) {
      this.prorderstatusField.setValue(this.prorder.prorderstatus.id);
    }
    if (this.prordermaterialsField.pristine) {
      this.prordermaterialsField.setValue(this.prorder.prordermaterialList);
    }
    if (this.prorderemployeesField.pristine) {
      this.prorderemployeesField.setValue(this.prorder.prorderemployeeList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.prorder.description);
    }
}

  async submit(): Promise<void> {
    this.prordermaterialUpdateSubForm.resetForm();
    this.prordermaterialsField.markAsDirty();
    this.prorderemployeeUpdateSubForm.resetForm();
    this.prorderemployeesField.markAsDirty();
    if (this.form.invalid) { return; }

    if (this.prorderstatusField.value === 3 || this.prorderstatusField.value === 4){
      if (this.doendField.value){
        if (this.prorderemployeesField.value){
          this.prorderemployeesField.value.forEach(employee => {
            employee.edate = this.doendField.value;
          });
        }
      }else {
        if (this.prorderemployeesField.value){
          this.prorderemployeesField.value.forEach(employee => {
            employee.edate = new Date();
          });
        }
      }
    }else {
      if (this.doendField.value){
        if (this.prorderemployeesField.value){
          this.prorderemployeesField.value.forEach(employee => {
            employee.edate = this.doendField.value;
          });
        }
      }
    }


    const newprorder: Prorder = new Prorder();
    newprorder.customorderitem = this.customorderitemField.value;
    newprorder.product = this.productField.value;
    newprorder.qty = this.qtyField.value;
    newprorder.dostart = DateHelper.getDateAsString(this.dostartField.value);
    newprorder.deadline = this.deadlineField.value ? DateHelper.getDateAsString(this.deadlineField.value) : null;
    newprorder.doend = this.doendField.value ? DateHelper.getDateAsString(this.doendField.value) : null;
    newprorder.prorderstatus = this.prorderstatusField.value;
    newprorder.prordermaterialList = this.prordermaterialsField.value;
    newprorder.prorderemployeeList = this.prorderemployeeUpdateSubForm.getValues();
    newprorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.prorderService.update(this.selectedId, newprorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/prorders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/prorders');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.customorderitem) { this.customorderitemField.setErrors({server: msg.customorderitem}); knownError = true; }
          if (msg.product) { this.productField.setErrors({server: msg.product}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.dostart) { this.dostartField.setErrors({server: msg.dostart}); knownError = true; }
          if (msg.deadline) { this.deadlineField.setErrors({server: msg.deadline}); knownError = true; }
          if (msg.doend) { this.doendField.setErrors({server: msg.doend}); knownError = true; }
          if (msg.prorderstatus) { this.prorderstatusField.setErrors({server: msg.prorderstatus}); knownError = true; }
          if (msg.prordermaterialList) { this.prordermaterialsField.setErrors({server: msg.prordermaterialList}); knownError = true; }
          if (msg.prorderemployeeList) { this.prorderemployeesField.setErrors({server: msg.prorderemployeeList}); knownError = true; }
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

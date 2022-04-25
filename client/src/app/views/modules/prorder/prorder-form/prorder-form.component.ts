import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Prorder} from '../../../../entities/prorder';
import {ProrderService} from '../../../../services/prorder.service';
import {ViewChild} from '@angular/core';
import {Product} from '../../../../entities/product';
import {DateHelper} from '../../../../shared/date-helper';
import {ProductService} from '../../../../services/product.service';
import {Customorderitem} from '../../../../entities/customorderitem';
import {CustomorderitemService} from '../../../../services/customorderitem.service';
import {PrordermaterialSubFormComponent} from './prordermaterial-sub-form/prordermaterial-sub-form.component';
import {ProrderemployeeSubFormComponent} from './prorderemployee-sub-form/prorderemployee-sub-form.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-prorder-form',
  templateUrl: './prorder-form.component.html',
  styleUrls: ['./prorder-form.component.scss']
})
export class ProrderFormComponent extends AbstractComponent implements OnInit {

  customorderitems: Customorderitem[] = [];
  products: Product[] = [];
  filteredOptions: Observable<Product[]>;
  @ViewChild(PrordermaterialSubFormComponent) prordermaterialSubForm: PrordermaterialSubFormComponent;
  @ViewChild(ProrderemployeeSubFormComponent) prorderemployeeSubForm: ProrderemployeeSubFormComponent;

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
    prordermaterials: new FormControl(),
    prorderemployees: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchproduct: new FormControl(),
  });

  get searchproductField(): FormControl{
    return this.form.controls.searchproduct as FormControl;
  }

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
    private prorderService: ProrderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchproductField.valueChanges
      .pipe(
        startWith(''),
        map(product => product ? this._filterProduct(product) : this.products.slice())
      );
  }

  private _filterProduct(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.customorderitemService.getAllForProduction(new PageRequest()).then((customorderitemDataPage) => {
      this.customorderitems = customorderitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productService.getAll(new PageRequest()).then((productDataPage) => {
      this.products = productDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRORDER);
  }

  async submit(): Promise<void> {
    this.prordermaterialSubForm.resetForm();
    this.prordermaterialsField.markAsDirty();
    this.prorderemployeeSubForm.resetForm();
    this.prorderemployeesField.markAsDirty();
    if (this.form.invalid) { return; }

    const prorder: Prorder = new Prorder();
    prorder.customorderitem = this.customorderitemField.value;
    prorder.product = this.productField.value;
    prorder.qty = this.qtyField.value;
    prorder.dostart = DateHelper.getDateAsString(this.dostartField.value);
    prorder.deadline = this.deadlineField.value ? DateHelper.getDateAsString(this.deadlineField.value) : null;
    prorder.prordermaterialList = this.prordermaterialsField.value;
    prorder.prorderemployeeList = this.prorderemployeeSubForm.getValues();
    prorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.prorderService.add(prorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/prorders/' + resourceLink.id);
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
          if (msg.customorderitem) { this.customorderitemField.setErrors({server: msg.customorderitem}); knownError = true; }
          if (msg.product) { this.productField.setErrors({server: msg.product}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.dostart) { this.dostartField.setErrors({server: msg.dostart}); knownError = true; }
          if (msg.deadline) { this.deadlineField.setErrors({server: msg.deadline}); knownError = true; }
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

  setSearchValue(option: any): void{
    console.log(option);
  }

  disableCMB(): void {
    this.customorderitemField.disable();
    this.searchproductField.disable();
    this.productField.disable();
  }
  datevalidation(): any{
    return new Date();
  }
}

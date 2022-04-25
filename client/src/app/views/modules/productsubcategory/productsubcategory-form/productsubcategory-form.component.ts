import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Productsubcategory} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';
import {Productcategory} from '../../../../entities/productcategory';
import {ProductcategoryService} from '../../../../services/productcategory.service';

@Component({
  selector: 'app-productsubcategory-form',
  templateUrl: './productsubcategory-form.component.html',
  styleUrls: ['./productsubcategory-form.component.scss']
})
export class ProductsubcategoryFormComponent extends AbstractComponent implements OnInit {

  productcategories: Productcategory[] = [];

  form = new FormGroup({
    productcategory: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
  });

  get productcategoryField(): FormControl{
    return this.form.controls.productcategory as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  constructor(
    private productcategoryService: ProductcategoryService,
    private productsubcategoryService: ProductsubcategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.productcategoryService.getAll().then((productcategories) => {
      this.productcategories = productcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTSUBCATEGORY);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const productsubcategory: Productsubcategory = new Productsubcategory();
    productsubcategory.productcategory = this.productcategoryField.value;
    productsubcategory.name = this.nameField.value;
    try{
      const resourceLink: ResourceLink = await this.productsubcategoryService.add(productsubcategory);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/productsubcategories/' + resourceLink.id);
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
          if (msg.productcategory) { this.productcategoryField.setErrors({server: msg.productcategory}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
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

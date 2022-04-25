import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Productsubcategory} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';
import {Productcategory} from '../../../../entities/productcategory';
import {ProductcategoryService} from '../../../../services/productcategory.service';

@Component({
  selector: 'app-productsubcategory-update-form',
  templateUrl: './productsubcategory-update-form.component.html',
  styleUrls: ['./productsubcategory-update-form.component.scss']
})
export class ProductsubcategoryUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  productsubcategory: Productsubcategory;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.productsubcategory = await this.productsubcategoryService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTSUBCATEGORY);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.productcategoryField.pristine) {
      this.productcategoryField.setValue(this.productsubcategory.productcategory.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.productsubcategory.name);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newproductsubcategory: Productsubcategory = new Productsubcategory();
    newproductsubcategory.productcategory = this.productcategoryField.value;
    newproductsubcategory.name = this.nameField.value;
    try{
      const resourceLink: ResourceLink = await this.productsubcategoryService.update(this.selectedId, newproductsubcategory);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/productsubcategories/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/productsubcategories');
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

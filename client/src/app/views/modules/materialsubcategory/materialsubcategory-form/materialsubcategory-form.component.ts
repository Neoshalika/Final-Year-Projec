import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Materialsubcategory} from '../../../../entities/materialsubcategory';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';
import {Materialcategory} from '../../../../entities/materialcategory';
import {MaterialcategoryService} from '../../../../services/materialcategory.service';

@Component({
  selector: 'app-materialsubcategory-form',
  templateUrl: './materialsubcategory-form.component.html',
  styleUrls: ['./materialsubcategory-form.component.scss']
})
export class MaterialsubcategoryFormComponent extends AbstractComponent implements OnInit {

  materialcategories: Materialcategory[] = [];

  form = new FormGroup({
    materialcategory: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ]),
  });

  get materialcategoryField(): FormControl{
    return this.form.controls.materialcategory as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  constructor(
    private materialcategoryService: MaterialcategoryService,
    private materialsubcategoryService: MaterialsubcategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.materialcategoryService.getAll().then((materialcategories) => {
      this.materialcategories = materialcategories;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALSUBCATEGORY);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const materialsubcategory: Materialsubcategory = new Materialsubcategory();
    materialsubcategory.materialcategory = this.materialcategoryField.value;
    materialsubcategory.name = this.nameField.value;
    try{
      const resourceLink: ResourceLink = await this.materialsubcategoryService.add(materialsubcategory);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materialsubcategories/' + resourceLink.id);
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
          if (msg.materialcategory) { this.materialcategoryField.setErrors({server: msg.materialcategory}); knownError = true; }
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

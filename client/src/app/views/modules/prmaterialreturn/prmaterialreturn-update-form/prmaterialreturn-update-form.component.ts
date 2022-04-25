import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Prmaterialreturn} from '../../../../entities/prmaterialreturn';
import {PrmaterialreturnService} from '../../../../services/prmaterialreturn.service';
import {ViewChild} from '@angular/core';
import {Prorder} from '../../../../entities/prorder';
import {DateHelper} from '../../../../shared/date-helper';
import {ProrderService} from '../../../../services/prorder.service';
import {PrmaterialreturnmaterialUpdateSubFormComponent} from './prmaterialreturnmaterial-update-sub-form/prmaterialreturnmaterial-update-sub-form.component';

@Component({
  selector: 'app-prmaterialreturn-update-form',
  templateUrl: './prmaterialreturn-update-form.component.html',
  styleUrls: ['./prmaterialreturn-update-form.component.scss']
})
export class PrmaterialreturnUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  prmaterialreturn: Prmaterialreturn;

  prorders: Prorder[] = [];
  @ViewChild(PrmaterialreturnmaterialUpdateSubFormComponent) prmaterialreturnmaterialUpdateSubForm: PrmaterialreturnmaterialUpdateSubFormComponent;

  form = new FormGroup({
    prorder: new FormControl(null, [
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    reason: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    prmaterialreturnmaterials: new FormControl(),
  });

  get prorderField(): FormControl{
    return this.form.controls.prorder as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get prmaterialreturnmaterialsField(): FormControl{
    return this.form.controls.prmaterialreturnmaterials as FormControl;
  }

  constructor(
    private prorderService: ProrderService,
    private prmaterialreturnService: PrmaterialreturnService,
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

    this.prorderService.getAllBasic(new PageRequest()).then((prorderDataPage) => {
      this.prorders = prorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.prmaterialreturn = await this.prmaterialreturnService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRMATERIALRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRMATERIALRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRMATERIALRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRMATERIALRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRMATERIALRETURN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.prorderField.pristine) {
      this.prorderField.setValue(this.prmaterialreturn.prorder.code);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.prmaterialreturn.date);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.prmaterialreturn.reason);
    }
    if (this.prmaterialreturnmaterialsField.pristine) {
      this.prmaterialreturnmaterialsField.setValue(this.prmaterialreturn.prmaterialreturnmaterialList);
    }
}

  async submit(): Promise<void> {
    this.prmaterialreturnmaterialUpdateSubForm.resetForm();
    this.prmaterialreturnmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newprmaterialreturn: Prmaterialreturn = new Prmaterialreturn();
    newprmaterialreturn.prorder = this.prorderField.value;
    newprmaterialreturn.date = DateHelper.getDateAsString(this.dateField.value);
    newprmaterialreturn.reason = this.reasonField.value;
    newprmaterialreturn.prmaterialreturnmaterialList = this.prmaterialreturnmaterialsField.value;
    try{
      const resourceLink: ResourceLink = await this.prmaterialreturnService.update(this.selectedId, newprmaterialreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/prmaterialreturns/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/prmaterialreturns');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.prorder) { this.prorderField.setErrors({server: msg.prorder}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.prmaterialreturnmaterialList) { this.prmaterialreturnmaterialsField.setErrors({server: msg.prmaterialreturnmaterialList}); knownError = true; }
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

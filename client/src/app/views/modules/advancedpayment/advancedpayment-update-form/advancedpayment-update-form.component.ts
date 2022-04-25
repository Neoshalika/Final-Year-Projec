import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Advancedpayment} from '../../../../entities/advancedpayment';
import {AdvancedpaymentService} from '../../../../services/advancedpayment.service';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {EmployeeService} from '../../../../services/employee.service';
import {Advancedpaymentstatus} from '../../../../entities/advancedpaymentstatus';
import {AdvancedpaymentstatusService} from '../../../../services/advancedpaymentstatus.service';

@Component({
  selector: 'app-advancedpayment-update-form',
  templateUrl: './advancedpayment-update-form.component.html',
  styleUrls: ['./advancedpayment-update-form.component.scss']
})
export class AdvancedpaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  advancedpayment: Advancedpayment;

  employees: Employee[] = [];
  advancedpaymentstatuses: Advancedpaymentstatus[] = [];

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    advancedpaymentstatus: new FormControl('1', [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get advancedpaymentstatusField(): FormControl{
    return this.form.controls.advancedpaymentstatus as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private advancedpaymentstatusService: AdvancedpaymentstatusService,
    private advancedpaymentService: AdvancedpaymentService,
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

    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.advancedpaymentstatusService.getAll().then((advancedpaymentstatuses) => {
      this.advancedpaymentstatuses = advancedpaymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.advancedpayment = await this.advancedpaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ADVANCEDPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ADVANCEDPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ADVANCEDPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ADVANCEDPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.advancedpayment.employee.id);
    }
    if (this.advancedpaymentstatusField.pristine) {
      this.advancedpaymentstatusField.setValue(this.advancedpayment.advancedpaymentstatus.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.advancedpayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.advancedpayment.amount);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.advancedpayment.reason);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newadvancedpayment: Advancedpayment = new Advancedpayment();
    newadvancedpayment.employee = this.employeeField.value;
    newadvancedpayment.advancedpaymentstatus = this.advancedpaymentstatusField.value;
    newadvancedpayment.date = DateHelper.getDateAsString(this.dateField.value);
    newadvancedpayment.amount = this.amountField.value;
    newadvancedpayment.reason = this.reasonField.value;
    try{
      const resourceLink: ResourceLink = await this.advancedpaymentService.update(this.selectedId, newadvancedpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/advancedpayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/advancedpayments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.advancedpaymentstatus) { this.advancedpaymentstatusField.setErrors({server: msg.advancedpaymentstatus}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
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

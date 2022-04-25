import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Attendance} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-attendance-update-form',
  templateUrl: './attendance-update-form.component.html',
  styleUrls: ['./attendance-update-form.component.scss']
})
export class AttendanceUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  attendance: Attendance;

  employees: Employee[] = [];

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    toin: new FormControl(null, [
      Validators.required,
    ]),
    toout: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get toinField(): FormControl{
    return this.form.controls.toin as FormControl;
  }

  get tooutField(): FormControl{
    return this.form.controls.toout as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
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
    this.attendance = await this.attendanceService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ATTENDANCE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.attendance.employee.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.attendance.date);
    }
    if (this.toinField.pristine) {
      this.toinField.setValue(this.attendance.toin);
    }
    if (this.tooutField.pristine) {
      this.tooutField.setValue(this.attendance.toout);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.attendance.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newattendance: Attendance = new Attendance();
    newattendance.employee = this.employeeField.value;
    newattendance.date = DateHelper.getDateAsString(this.dateField.value);
    newattendance.toin = this.toinField.value;
    newattendance.toout = this.tooutField.value;
    newattendance.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.attendanceService.update(this.selectedId, newattendance);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/attendances/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/attendances');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.toin) { this.toinField.setErrors({server: msg.toin}); knownError = true; }
          if (msg.toout) { this.tooutField.setErrors({server: msg.toout}); knownError = true; }
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

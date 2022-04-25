import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Delivery} from '../../../../entities/delivery';
import {DeliveryService} from '../../../../services/delivery.service';
import {Vehicle} from '../../../../entities/vehicle';
import {Employee} from '../../../../entities/employee';
import {Customerorder} from '../../../../entities/customerorder';
import {VehicleService} from '../../../../services/vehicle.service';
import {EmployeeService} from '../../../../services/employee.service';
import {CustomerorderService} from '../../../../services/customerorder.service';

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.scss']
})
export class DeliveryFormComponent extends AbstractComponent implements OnInit {

  customerorders: Customerorder[] = [];
  vehicles: Vehicle[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    customerorder: new FormControl(null, [
      Validators.required,
    ]),
    vehicle: new FormControl(null, [
      Validators.required,
    ]),
    contactname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    contactno: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    permitno: new FormControl(null, [
      Validators.minLength(1),
      Validators.maxLength(10),
    ]),
    distance: new FormControl(null, [
      Validators.min(10),
      Validators.max(1000),
      Validators.pattern('^([0-9]*)$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    employees: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get customerorderField(): FormControl{
    return this.form.controls.customerorder as FormControl;
  }

  get vehicleField(): FormControl{
    return this.form.controls.vehicle as FormControl;
  }

  get contactnameField(): FormControl{
    return this.form.controls.contactname as FormControl;
  }

  get contactnoField(): FormControl{
    return this.form.controls.contactno as FormControl;
  }

  get permitnoField(): FormControl{
    return this.form.controls.permitno as FormControl;
  }

  get distanceField(): FormControl{
    return this.form.controls.distance as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private customerorderService: CustomerorderService,
    private vehicleService: VehicleService,
    private employeeService: EmployeeService,
    private deliveryService: DeliveryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
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

    this.customerorderService.getAllBasic(new PageRequest()).then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehicleService.getAllBasic(new PageRequest()).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DELIVERY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DELIVERIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DELIVERY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DELIVERY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DELIVERY);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const delivery: Delivery = new Delivery();
    delivery.customerorder = this.customerorderField.value;
    delivery.vehicle = this.vehicleField.value;
    delivery.contactname = this.contactnameField.value;
    delivery.contactno = this.contactnoField.value;
    delivery.permitno = this.permitnoField.value;
    delivery.distance = this.distanceField.value;
    delivery.address = this.addressField.value;
    delivery.employeeList = this.employeesField.value;
    delivery.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.deliveryService.add(delivery);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/deliveries/' + resourceLink.id);
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
          if (msg.vehicle) { this.vehicleField.setErrors({server: msg.vehicle}); knownError = true; }
          if (msg.contactname) { this.contactnameField.setErrors({server: msg.contactname}); knownError = true; }
          if (msg.contactno) { this.contactnoField.setErrors({server: msg.contactno}); knownError = true; }
          if (msg.permitno) { this.permitnoField.setErrors({server: msg.permitno}); knownError = true; }
          if (msg.distance) { this.distanceField.setErrors({server: msg.distance}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.employeeList) { this.employeesField.setErrors({server: msg.employeeList}); knownError = true; }
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

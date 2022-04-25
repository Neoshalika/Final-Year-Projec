import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Delivery} from '../../../../entities/delivery';
import {DeliveryService} from '../../../../services/delivery.service';
import {Vehicle} from '../../../../entities/vehicle';
import {Employee} from '../../../../entities/employee';
import {Customerorder} from '../../../../entities/customerorder';
import {Deliverystatus} from '../../../../entities/deliverystatus';
import {VehicleService} from '../../../../services/vehicle.service';
import {EmployeeService} from '../../../../services/employee.service';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {DeliverystatusService} from '../../../../services/deliverystatus.service';

@Component({
  selector: 'app-delivery-update-form',
  templateUrl: './delivery-update-form.component.html',
  styleUrls: ['./delivery-update-form.component.scss']
})
export class DeliveryUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  delivery: Delivery;

  customerorders: Customerorder[] = [];
  vehicles: Vehicle[] = [];
  deliverystatuses: Deliverystatus[] = [];
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
    deliverystatus: new FormControl('1', [
      Validators.required,
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

  get deliverystatusField(): FormControl{
    return this.form.controls.deliverystatus as FormControl;
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
    private deliverystatusService: DeliverystatusService,
    private employeeService: EmployeeService,
    private deliveryService: DeliveryService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.deliverystatusService.getAll().then((deliverystatuses) => {
      this.deliverystatuses = deliverystatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
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
    this.delivery = await this.deliveryService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DELIVERY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DELIVERIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DELIVERY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DELIVERY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DELIVERY);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.customerorderField.pristine) {
      this.customerorderField.setValue(this.delivery.customerorder.id);
    }
    if (this.vehicleField.pristine) {
      this.vehicleField.setValue(this.delivery.vehicle.id);
    }
    if (this.contactnameField.pristine) {
      this.contactnameField.setValue(this.delivery.contactname);
    }
    if (this.contactnoField.pristine) {
      this.contactnoField.setValue(this.delivery.contactno);
    }
    if (this.permitnoField.pristine) {
      this.permitnoField.setValue(this.delivery.permitno);
    }
    if (this.distanceField.pristine) {
      this.distanceField.setValue(this.delivery.distance);
    }
    if (this.deliverystatusField.pristine) {
      this.deliverystatusField.setValue(this.delivery.deliverystatus.id);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.delivery.address);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.delivery.employeeList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.delivery.description);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const newdelivery: Delivery = new Delivery();
    newdelivery.customerorder = this.customerorderField.value;
    newdelivery.vehicle = this.vehicleField.value;
    newdelivery.contactname = this.contactnameField.value;
    newdelivery.contactno = this.contactnoField.value;
    newdelivery.permitno = this.permitnoField.value;
    newdelivery.distance = this.distanceField.value;
    newdelivery.deliverystatus = this.deliverystatusField.value;
    newdelivery.address = this.addressField.value;
    newdelivery.employeeList = this.employeesField.value;
    newdelivery.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.deliveryService.update(this.selectedId, newdelivery);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/deliveries/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/deliveries');
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
          if (msg.deliverystatus) { this.deliverystatusField.setErrors({server: msg.deliverystatus}); knownError = true; }
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

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Vehicle} from '../../../../entities/vehicle';
import {VehicleService} from '../../../../services/vehicle.service';
import {Vehiclestatus} from '../../../../entities/vehiclestatus';
import {VehiclestatusService} from '../../../../services/vehiclestatus.service';

@Component({
  selector: 'app-vehicle-update-form',
  templateUrl: './vehicle-update-form.component.html',
  styleUrls: ['./vehicle-update-form.component.scss']
})
export class VehicleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  vehicle: Vehicle;

  vehiclestatuses: Vehiclestatus[] = [];

  form = new FormGroup({
    no: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    brand: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    modal: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    vehiclestatus: new FormControl('1', [
      Validators.required,
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get noField(): FormControl{
    return this.form.controls.no as FormControl;
  }

  get brandField(): FormControl{
    return this.form.controls.brand as FormControl;
  }

  get modalField(): FormControl{
    return this.form.controls.modal as FormControl;
  }

  get vehiclestatusField(): FormControl{
    return this.form.controls.vehiclestatus as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vehiclestatusService: VehiclestatusService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.vehiclestatusService.getAll().then((vehiclestatuses) => {
      this.vehiclestatuses = vehiclestatuses;
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

    this.vehicle = await this.vehicleService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.noField.pristine) {
      this.noField.setValue(this.vehicle.no);
    }
    if (this.brandField.pristine) {
      this.brandField.setValue(this.vehicle.brand);
    }
    if (this.modalField.pristine) {
      this.modalField.setValue(this.vehicle.modal);
    }
    if (this.vehiclestatusField.pristine) {
      this.vehiclestatusField.setValue(this.vehicle.vehiclestatus.id);
    }
    if (this.photoField.pristine) {
      if (this.vehicle.photo) { this.photoField.setValue([this.vehicle.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.vehicle.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newvehicle: Vehicle = new Vehicle();
    newvehicle.no = this.noField.value;
    newvehicle.brand = this.brandField.value;
    newvehicle.modal = this.modalField.value;
    newvehicle.vehiclestatus = this.vehiclestatusField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newvehicle.photo = photoIds[0];
    }else{
      newvehicle.photo = null;
    }
    newvehicle.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.vehicleService.update(this.selectedId, newvehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/vehicles');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.no) { this.noField.setErrors({server: msg.no}); knownError = true; }
          if (msg.brand) { this.brandField.setErrors({server: msg.brand}); knownError = true; }
          if (msg.modal) { this.modalField.setErrors({server: msg.modal}); knownError = true; }
          if (msg.vehiclestatus) { this.vehiclestatusField.setErrors({server: msg.vehiclestatus}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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

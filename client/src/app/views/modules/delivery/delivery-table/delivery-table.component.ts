import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Delivery, DeliveryDataPage} from '../../../../entities/delivery';
import {DeliveryService} from '../../../../services/delivery.service';
import {Vehicle} from '../../../../entities/vehicle';
import {VehicleService} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  styleUrls: ['./delivery-table.component.scss']
})
export class DeliveryTableComponent extends AbstractComponent implements OnInit {

  deliveryDataPage: DeliveryDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vehicles: Vehicle[] = [];

  codeField = new FormControl();
  vehicleField = new FormControl();
  permitnoField = new FormControl();

  constructor(
    private vehicleService: VehicleService,
    private deliveryService: DeliveryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('vehicle', this.vehicleField.value);
    pageRequest.addSearchCriteria('permitno', this.permitnoField.value);

    this.vehicleService.getAllBasic(new PageRequest()).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.deliveryService.getAll(pageRequest).then((page: DeliveryDataPage) => {
      this.deliveryDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'customerorder', 'vehicle', 'contactname', 'contactno', 'permitno'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(delivery: Delivery): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: delivery.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.deliveryService.delete(delivery.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

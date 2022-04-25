import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerorder, CustomerorderDataPage} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';
import {Customer} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';

@Component({
  selector: 'app-customerorder-table',
  templateUrl: './customerorder-table.component.html',
  styleUrls: ['./customerorder-table.component.scss']
})
export class CustomerorderTableComponent extends AbstractComponent implements OnInit {

  customerorderDataPage: CustomerorderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  customers: Customer[] = [];

  codeField = new FormControl();
  customerField = new FormControl();

  constructor(
    private customerService: CustomerService,
    private customerorderService: CustomerorderService,
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
    pageRequest.addSearchCriteria('customer', this.customerField.value);

    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.customerorderService.getAll(pageRequest).then((page: CustomerorderDataPage) => {
      this.customerorderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'customer', 'doordered', 'dorequired', 'total', 'balance', 'customerorderstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customerorder: Customerorder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customerorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerorderService.delete(customerorder.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerrefund, CustomerrefundDataPage} from '../../../../entities/customerrefund';
import {CustomerrefundService} from '../../../../services/customerrefund.service';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';

@Component({
  selector: 'app-customerrefund-table',
  templateUrl: './customerrefund-table.component.html',
  styleUrls: ['./customerrefund-table.component.scss']
})
export class CustomerrefundTableComponent extends AbstractComponent implements OnInit {

  customerrefundDataPage: CustomerrefundDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  customerorders: Customerorder[] = [];

  codeField = new FormControl();
  customerorderField = new FormControl();
  chequenoField = new FormControl();

  constructor(
    private customerorderService: CustomerorderService,
    private customerrefundService: CustomerrefundService,
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
    pageRequest.addSearchCriteria('customerorder', this.customerorderField.value);
    pageRequest.addSearchCriteria('chequeno', this.chequenoField.value);

    this.customerorderService.getAllBasic(new PageRequest()).then((customerorderDataPage) => {
      this.customerorders = customerorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.customerrefundService.getAll(pageRequest).then((page: CustomerrefundDataPage) => {
      this.customerrefundDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERREFUND);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'customerorder', 'paymenttype', 'paymentstatus', 'date', 'amount', 'chequeno'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customerrefund: Customerrefund): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customerrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerrefundService.delete(customerrefund.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

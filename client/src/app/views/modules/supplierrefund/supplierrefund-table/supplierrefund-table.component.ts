import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplierrefund, SupplierrefundDataPage} from '../../../../entities/supplierrefund';
import {SupplierrefundService} from '../../../../services/supplierrefund.service';

@Component({
  selector: 'app-supplierrefund-table',
  templateUrl: './supplierrefund-table.component.html',
  styleUrls: ['./supplierrefund-table.component.scss']
})
export class SupplierrefundTableComponent extends AbstractComponent implements OnInit {

  supplierrefundDataPage: SupplierrefundDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  amountField = new FormControl();
  chequenoField = new FormControl();

  constructor(
    private supplierrefundService: SupplierrefundService,
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
    pageRequest.addSearchCriteria('amount', this.amountField.value);
    pageRequest.addSearchCriteria('chequeno', this.chequenoField.value);


    this.supplierrefundService.getAll(pageRequest).then((page: SupplierrefundDataPage) => {
      this.supplierrefundDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERREFUND);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'purchase', 'date', 'amount', 'chequeno', 'chequebank'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(supplierrefund: Supplierrefund): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: supplierrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.supplierrefundService.delete(supplierrefund.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

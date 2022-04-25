import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplierreturn, SupplierreturnDataPage} from '../../../../entities/supplierreturn';
import {SupplierreturnService} from '../../../../services/supplierreturn.service';
import {Purchase} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {Supplierreturnstatus} from '../../../../entities/supplierreturnstatus';
import {SupplierreturnstatusService} from '../../../../services/supplierreturnstatus.service';

@Component({
  selector: 'app-supplierreturn-table',
  templateUrl: './supplierreturn-table.component.html',
  styleUrls: ['./supplierreturn-table.component.scss']
})
export class SupplierreturnTableComponent extends AbstractComponent implements OnInit {

  supplierreturnDataPage: SupplierreturnDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  purchases: Purchase[] = [];
  supplierreturnstatuses: Supplierreturnstatus[] = [];

  codeField = new FormControl();
  purchaseField = new FormControl();
  supplierreturnstatusField = new FormControl();

  constructor(
    private purchaseService: PurchaseService,
    private supplierreturnstatusService: SupplierreturnstatusService,
    private supplierreturnService: SupplierreturnService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.supplierreturnstatusService.getAll().then((supplierreturnstatuses) => {
      this.supplierreturnstatuses = supplierreturnstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

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
    pageRequest.addSearchCriteria('purchase', this.purchaseField.value);
    pageRequest.addSearchCriteria('supplierreturnstatus', this.supplierreturnstatusField.value);

    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.supplierreturnService.getAll(pageRequest).then((page: SupplierreturnDataPage) => {
      this.supplierreturnDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'purchase', 'supplierreturnstatus', 'doreturned', 'dorecived'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(supplierreturn: Supplierreturn): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: supplierreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.supplierreturnService.delete(supplierreturn.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Prmaterialreturn, PrmaterialreturnDataPage} from '../../../../entities/prmaterialreturn';
import {PrmaterialreturnService} from '../../../../services/prmaterialreturn.service';
import {Prorder} from '../../../../entities/prorder';
import {ProrderService} from '../../../../services/prorder.service';

@Component({
  selector: 'app-prmaterialreturn-table',
  templateUrl: './prmaterialreturn-table.component.html',
  styleUrls: ['./prmaterialreturn-table.component.scss']
})
export class PrmaterialreturnTableComponent extends AbstractComponent implements OnInit {

  prmaterialreturnDataPage: PrmaterialreturnDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  prorders: Prorder[] = [];

  codeField = new FormControl();
  prorderField = new FormControl();

  constructor(
    private prorderService: ProrderService,
    private prmaterialreturnService: PrmaterialreturnService,
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
    pageRequest.addSearchCriteria('prorder', this.prorderField.value);

    this.prorderService.getAllBasic(new PageRequest()).then((prorderDataPage) => {
      this.prorders = prorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.prmaterialreturnService.getAll(pageRequest).then((page: PrmaterialreturnDataPage) => {
      this.prmaterialreturnDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRMATERIALRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRMATERIALRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRMATERIALRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRMATERIALRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRMATERIALRETURN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'prorder', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(prmaterialreturn: Prmaterialreturn): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: prmaterialreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.prmaterialreturnService.delete(prmaterialreturn.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

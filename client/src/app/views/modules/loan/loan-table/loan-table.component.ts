import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Loan, LoanDataPage} from '../../../../entities/loan';
import {LoanService} from '../../../../services/loan.service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {PaymenttypeService} from '../../../../services/paymenttype.service';

@Component({
  selector: 'app-loan-table',
  templateUrl: './loan-table.component.html',
  styleUrls: ['./loan-table.component.scss']
})
export class LoanTableComponent extends AbstractComponent implements OnInit {

  loanDataPage: LoanDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  paymenttypes: Paymenttype[] = [];

  codeField = new FormControl();
  paymenttypeField = new FormControl();
  chequenoField = new FormControl();

  constructor(
    private paymenttypeService: PaymenttypeService,
    private loanService: LoanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
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
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);
    pageRequest.addSearchCriteria('chequeno', this.chequenoField.value);


    this.loanService.getAll(pageRequest).then((page: LoanDataPage) => {
      this.loanDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOAN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'employee', 'paymenttype', 'amount', 'chequeno', 'chequebank'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(loan: Loan): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: loan.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.loanService.delete(loan.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

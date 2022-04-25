import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Loanrepayment, LoanrepaymentDataPage} from '../../../../entities/loanrepayment';
import {LoanrepaymentService} from '../../../../services/loanrepayment.service';
import {Loan} from '../../../../entities/loan';
import {LoanService} from '../../../../services/loan.service';

@Component({
  selector: 'app-loanrepayment-table',
  templateUrl: './loanrepayment-table.component.html',
  styleUrls: ['./loanrepayment-table.component.scss']
})
export class LoanrepaymentTableComponent extends AbstractComponent implements OnInit {

  loanrepaymentDataPage: LoanrepaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  loans: Loan[] = [];

  codeField = new FormControl();
  loanField = new FormControl();
  amountField = new FormControl();

  constructor(
    private loanService: LoanService,
    private loanrepaymentService: LoanrepaymentService,
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
    pageRequest.addSearchCriteria('loan', this.loanField.value);
    pageRequest.addSearchCriteria('amount', this.amountField.value);

    this.loanService.getAllBasic(new PageRequest()).then((loanDataPage) => {
      this.loans = loanDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.loanrepaymentService.getAll(pageRequest).then((page: LoanrepaymentDataPage) => {
      this.loanrepaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOANREPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANREPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOANREPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOANREPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOANREPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'loan', 'date', 'amount'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(loanrepayment: Loanrepayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: loanrepayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.loanrepaymentService.delete(loanrepayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Advancedpayment, AdvancedpaymentDataPage} from '../../../../entities/advancedpayment';
import {AdvancedpaymentService} from '../../../../services/advancedpayment.service';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {Advancedpaymentstatus} from '../../../../entities/advancedpaymentstatus';
import {AdvancedpaymentstatusService} from '../../../../services/advancedpaymentstatus.service';

@Component({
  selector: 'app-advancedpayment-table',
  templateUrl: './advancedpayment-table.component.html',
  styleUrls: ['./advancedpayment-table.component.scss']
})
export class AdvancedpaymentTableComponent extends AbstractComponent implements OnInit {

  advancedpaymentDataPage: AdvancedpaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  employees: Employee[] = [];
  advancedpaymentstatuses: Advancedpaymentstatus[] = [];

  codeField = new FormControl();
  employeeField = new FormControl();
  advancedpaymentstatusField = new FormControl();

  constructor(
    private employeeService: EmployeeService,
    private advancedpaymentstatusService: AdvancedpaymentstatusService,
    private advancedpaymentService: AdvancedpaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.advancedpaymentstatusService.getAll().then((advancedpaymentstatuses) => {
      this.advancedpaymentstatuses = advancedpaymentstatuses;
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
    pageRequest.addSearchCriteria('employee', this.employeeField.value);
    pageRequest.addSearchCriteria('advancedpaymentstatus', this.advancedpaymentstatusField.value);

    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.advancedpaymentService.getAll(pageRequest).then((page: AdvancedpaymentDataPage) => {
      this.advancedpaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ADVANCEDPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ADVANCEDPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ADVANCEDPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ADVANCEDPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'employee', 'advancedpaymentstatus', 'date', 'amount'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(advancedpayment: Advancedpayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: advancedpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.advancedpaymentService.delete(advancedpayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

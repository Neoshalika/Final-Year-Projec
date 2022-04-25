import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Loanrepayment} from '../../../../entities/loanrepayment';
import {LoanrepaymentService} from '../../../../services/loanrepayment.service';

@Component({
  selector: 'app-loanrepayment-detail',
  templateUrl: './loanrepayment-detail.component.html',
  styleUrls: ['./loanrepayment-detail.component.scss']
})
export class LoanrepaymentDetailComponent extends AbstractComponent implements OnInit {

  loanrepayment: Loanrepayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private loanrepaymentService: LoanrepaymentService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.loanrepayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.loanrepaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/loanrepayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.loanrepayment = await this.loanrepaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LOANREPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LOANREPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LOANREPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LOANREPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LOANREPAYMENT);
  }
}

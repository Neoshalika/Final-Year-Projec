import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Advancedpayment} from '../../../../entities/advancedpayment';
import {AdvancedpaymentService} from '../../../../services/advancedpayment.service';

@Component({
  selector: 'app-advancedpayment-detail',
  templateUrl: './advancedpayment-detail.component.html',
  styleUrls: ['./advancedpayment-detail.component.scss']
})
export class AdvancedpaymentDetailComponent extends AbstractComponent implements OnInit {

  advancedpayment: Advancedpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private advancedpaymentService: AdvancedpaymentService,
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
      data: {message: this.advancedpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.advancedpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/advancedpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.advancedpayment = await this.advancedpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ADVANCEDPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ADVANCEDPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ADVANCEDPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ADVANCEDPAYMENT);
  }
}

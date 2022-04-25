import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerrefund} from '../../../../entities/customerrefund';
import {CustomerrefundService} from '../../../../services/customerrefund.service';

@Component({
  selector: 'app-customerrefund-detail',
  templateUrl: './customerrefund-detail.component.html',
  styleUrls: ['./customerrefund-detail.component.scss']
})
export class CustomerrefundDetailComponent extends AbstractComponent implements OnInit {

  customerrefund: Customerrefund;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customerrefundService: CustomerrefundService,
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
      data: {message: this.customerrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customerrefundService.delete(this.selectedId);
        await this.router.navigateByUrl('/customerrefunds');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customerrefund = await this.customerrefundService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERREFUND);
  }
}

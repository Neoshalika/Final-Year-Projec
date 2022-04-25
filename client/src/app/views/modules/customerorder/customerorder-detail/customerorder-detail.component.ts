import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerorder} from '../../../../entities/customerorder';
import {CustomerorderService} from '../../../../services/customerorder.service';

@Component({
  selector: 'app-customerorder-detail',
  templateUrl: './customerorder-detail.component.html',
  styleUrls: ['./customerorder-detail.component.scss']
})
export class CustomerorderDetailComponent extends AbstractComponent implements OnInit {

  customerorder: Customerorder;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customerorderService: CustomerorderService,
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
      data: {message: this.customerorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customerorderService.delete(this.selectedId);
        await this.router.navigateByUrl('/customerorders');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customerorder = await this.customerorderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERORDER);
  }
}

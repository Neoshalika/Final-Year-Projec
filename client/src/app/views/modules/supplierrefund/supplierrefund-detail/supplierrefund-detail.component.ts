import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplierrefund} from '../../../../entities/supplierrefund';
import {SupplierrefundService} from '../../../../services/supplierrefund.service';

@Component({
  selector: 'app-supplierrefund-detail',
  templateUrl: './supplierrefund-detail.component.html',
  styleUrls: ['./supplierrefund-detail.component.scss']
})
export class SupplierrefundDetailComponent extends AbstractComponent implements OnInit {

  supplierrefund: Supplierrefund;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private supplierrefundService: SupplierrefundService,
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
      data: {message: this.supplierrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.supplierrefundService.delete(this.selectedId);
        await this.router.navigateByUrl('/supplierrefunds');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.supplierrefund = await this.supplierrefundService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERREFUND);
  }
}

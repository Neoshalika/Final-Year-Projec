import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Prorder} from '../../../../entities/prorder';
import {ProrderService} from '../../../../services/prorder.service';

@Component({
  selector: 'app-prorder-detail',
  templateUrl: './prorder-detail.component.html',
  styleUrls: ['./prorder-detail.component.scss']
})
export class ProrderDetailComponent extends AbstractComponent implements OnInit {

  prorder: Prorder;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private prorderService: ProrderService,
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
      data: {message: this.prorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.prorderService.delete(this.selectedId);
        await this.router.navigateByUrl('/prorders');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.prorder = await this.prorderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRORDER);
  }
}

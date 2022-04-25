import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customorderitem} from '../../../../entities/customorderitem';
import {CustomorderitemService} from '../../../../services/customorderitem.service';

@Component({
  selector: 'app-customorderitem-detail',
  templateUrl: './customorderitem-detail.component.html',
  styleUrls: ['./customorderitem-detail.component.scss']
})
export class CustomorderitemDetailComponent extends AbstractComponent implements OnInit {

  customorderitem: Customorderitem;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customorderitemService: CustomorderitemService,
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
      data: {message: this.customorderitem.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customorderitemService.delete(this.selectedId);
        await this.router.navigateByUrl('/customorderitems');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customorderitem = await this.customorderitemService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMORDERITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMORDERITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMORDERITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMORDERITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMORDERITEM);
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Prmaterialreturn} from '../../../../entities/prmaterialreturn';
import {PrmaterialreturnService} from '../../../../services/prmaterialreturn.service';

@Component({
  selector: 'app-prmaterialreturn-detail',
  templateUrl: './prmaterialreturn-detail.component.html',
  styleUrls: ['./prmaterialreturn-detail.component.scss']
})
export class PrmaterialreturnDetailComponent extends AbstractComponent implements OnInit {

  prmaterialreturn: Prmaterialreturn;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private prmaterialreturnService: PrmaterialreturnService,
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
      data: {message: this.prmaterialreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.prmaterialreturnService.delete(this.selectedId);
        await this.router.navigateByUrl('/prmaterialreturns');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.prmaterialreturn = await this.prmaterialreturnService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRMATERIALRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRMATERIALRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRMATERIALRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRMATERIALRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRMATERIALRETURN);
  }
}

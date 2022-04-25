import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Materialsubcategory} from '../../../../entities/materialsubcategory';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';

@Component({
  selector: 'app-materialsubcategory-detail',
  templateUrl: './materialsubcategory-detail.component.html',
  styleUrls: ['./materialsubcategory-detail.component.scss']
})
export class MaterialsubcategoryDetailComponent extends AbstractComponent implements OnInit {

  materialsubcategory: Materialsubcategory;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private materialsubcategoryService: MaterialsubcategoryService,
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
      data: {message: this.materialsubcategory.code + '-' + this.materialsubcategory.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.materialsubcategoryService.delete(this.selectedId);
        await this.router.navigateByUrl('/materialsubcategories');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.materialsubcategory = await this.materialsubcategoryService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALSUBCATEGORY);
  }
}

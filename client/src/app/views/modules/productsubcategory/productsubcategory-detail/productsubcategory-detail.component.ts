import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Productsubcategory} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';

@Component({
  selector: 'app-productsubcategory-detail',
  templateUrl: './productsubcategory-detail.component.html',
  styleUrls: ['./productsubcategory-detail.component.scss']
})
export class ProductsubcategoryDetailComponent extends AbstractComponent implements OnInit {

  productsubcategory: Productsubcategory;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private productsubcategoryService: ProductsubcategoryService,
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
      data: {message: this.productsubcategory.code + '-' + this.productsubcategory.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.productsubcategoryService.delete(this.selectedId);
        await this.router.navigateByUrl('/productsubcategories');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.productsubcategory = await this.productsubcategoryService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTSUBCATEGORY);
  }
}

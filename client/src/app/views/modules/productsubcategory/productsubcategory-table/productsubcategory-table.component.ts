import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Productsubcategory, ProductsubcategoryDataPage} from '../../../../entities/productsubcategory';
import {ProductsubcategoryService} from '../../../../services/productsubcategory.service';
import {Productcategory} from '../../../../entities/productcategory';
import {ProductcategoryService} from '../../../../services/productcategory.service';

@Component({
  selector: 'app-productsubcategory-table',
  templateUrl: './productsubcategory-table.component.html',
  styleUrls: ['./productsubcategory-table.component.scss']
})
export class ProductsubcategoryTableComponent extends AbstractComponent implements OnInit {

  productsubcategoryDataPage: ProductsubcategoryDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  productcategories: Productcategory[] = [];

  codeField = new FormControl();
  productcategoryField = new FormControl();

  constructor(
    private productcategoryService: ProductcategoryService,
    private productsubcategoryService: ProductsubcategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.productcategoryService.getAll().then((productcategories) => {
      this.productcategories = productcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('productcategory', this.productcategoryField.value);


    this.productsubcategoryService.getAll(pageRequest).then((page: ProductsubcategoryDataPage) => {
      this.productsubcategoryDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTSUBCATEGORY);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'productcategory', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(productsubcategory: Productsubcategory): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: productsubcategory.code + '-' + productsubcategory.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.productsubcategoryService.delete(productsubcategory.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

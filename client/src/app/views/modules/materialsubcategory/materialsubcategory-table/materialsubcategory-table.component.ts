import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Materialsubcategory, MaterialsubcategoryDataPage} from '../../../../entities/materialsubcategory';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';
import {Materialcategory} from '../../../../entities/materialcategory';
import {MaterialcategoryService} from '../../../../services/materialcategory.service';

@Component({
  selector: 'app-materialsubcategory-table',
  templateUrl: './materialsubcategory-table.component.html',
  styleUrls: ['./materialsubcategory-table.component.scss']
})
export class MaterialsubcategoryTableComponent extends AbstractComponent implements OnInit {

  materialsubcategoryDataPage: MaterialsubcategoryDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  materialcategories: Materialcategory[] = [];

  codeField = new FormControl();
  materialcategoryField = new FormControl();
  nameField = new FormControl();

  constructor(
    private materialcategoryService: MaterialcategoryService,
    private materialsubcategoryService: MaterialsubcategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.materialcategoryService.getAll().then((materialcategories) => {
      this.materialcategories = materialcategories;
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
    pageRequest.addSearchCriteria('materialcategory', this.materialcategoryField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);


    this.materialsubcategoryService.getAll(pageRequest).then((page: MaterialsubcategoryDataPage) => {
      this.materialsubcategoryDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALSUBCATEGORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALSUBCATEGORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALSUBCATEGORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALSUBCATEGORY);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'materialcategory', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(materialsubcategory: Materialsubcategory): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: materialsubcategory.code + '-' + materialsubcategory.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.materialsubcategoryService.delete(materialsubcategory.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

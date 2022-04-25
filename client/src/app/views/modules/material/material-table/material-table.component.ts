import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Material, MaterialDataPage} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Materialsubcategory} from '../../../../entities/materialsubcategory';
import {MaterialsubcategoryService} from '../../../../services/materialsubcategory.service';
import {Materialstatus} from '../../../../entities/materialstatus';
import {MaterialstatusService} from '../../../../services/materialstatus.service';

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent extends AbstractComponent implements OnInit {

  materialDataPage: MaterialDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  materialsubcategories: Materialsubcategory[] = [];
  materialstatuses: Materialstatus[] = [];

  codeField = new FormControl();
  materialsubcategoryField = new FormControl();
  nameField = new FormControl();
  statusField = new FormControl();

  constructor(
    private materialsubcategoryService: MaterialsubcategoryService,
    private materialService: MaterialService,
    private materialstatusService: MaterialstatusService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

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
    pageRequest.addSearchCriteria('materialsubcategory', this.materialsubcategoryField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('status', this.statusField.value);

    this.materialsubcategoryService.getAllBasic(new PageRequest()).then((materialsubcategoryDataPage) => {
      this.materialsubcategories = materialsubcategoryDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.materialService.getAll(pageRequest).then((page: MaterialDataPage) => {
      this.materialDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'code', 'name', 'materialsubcategory', 'unit',  'materialstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(material: Material): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: material.materialsubcategory.name + '-' + material.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.materialService.delete(material.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

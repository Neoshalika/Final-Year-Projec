import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Prorder, ProrderDataPage} from '../../../../entities/prorder';
import {ProrderService} from '../../../../services/prorder.service';
import {Product} from '../../../../entities/product';
import {Prorderstatus} from '../../../../entities/prorderstatus';
import {ProductService} from '../../../../services/product.service';
import {Customorderitem} from '../../../../entities/customorderitem';
import {ProrderstatusService} from '../../../../services/prorderstatus.service';
import {CustomorderitemService} from '../../../../services/customorderitem.service';

@Component({
  selector: 'app-prorder-table',
  templateUrl: './prorder-table.component.html',
  styleUrls: ['./prorder-table.component.scss']
})
export class ProrderTableComponent extends AbstractComponent implements OnInit {

  prorderDataPage: ProrderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  customorderitems: Customorderitem[] = [];
  products: Product[] = [];
  prorderstatuses: Prorderstatus[] = [];

  codeField = new FormControl();
  customorderitemField = new FormControl();
  productField = new FormControl();
  prorderstatusField = new FormControl();

  constructor(
    private customorderitemService: CustomorderitemService,
    private productService: ProductService,
    private prorderstatusService: ProrderstatusService,
    private prorderService: ProrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.prorderstatusService.getAll().then((prorderstatuses) => {
      this.prorderstatuses = prorderstatuses;
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
    pageRequest.addSearchCriteria('customorderitem', this.customorderitemField.value);
    pageRequest.addSearchCriteria('product', this.productField.value);
    pageRequest.addSearchCriteria('prorderstatus', this.prorderstatusField.value);

    this.customorderitemService.getAllBasic(new PageRequest()).then((customorderitemDataPage) => {
      this.customorderitems = customorderitemDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productService.getAllBasic(new PageRequest()).then((productDataPage) => {
      this.products = productDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.prorderService.getAll(pageRequest).then((page: ProrderDataPage) => {
      this.prorderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'customorderitem', 'product', 'qty', 'dostart', 'prorderstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(prorder: Prorder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: prorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.prorderService.delete(prorder.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}

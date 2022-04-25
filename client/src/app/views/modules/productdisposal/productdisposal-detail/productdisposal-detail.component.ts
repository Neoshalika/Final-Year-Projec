import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Productdisposal} from '../../../../entities/productdisposal';
import {ProductdisposalService} from '../../../../services/productdisposal.service';

@Component({
  selector: 'app-productdisposal-detail',
  templateUrl: './productdisposal-detail.component.html',
  styleUrls: ['./productdisposal-detail.component.scss']
})
export class ProductdisposalDetailComponent extends AbstractComponent implements OnInit {

  productdisposal: Productdisposal;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private productdisposalService: ProductdisposalService,
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
      data: {message: this.productdisposal.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.productdisposalService.delete(this.selectedId);
        await this.router.navigateByUrl('/productdisposals');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.productdisposal = await this.productdisposalService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCTDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCTDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCTDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCTDISPOSAL);
  }
}

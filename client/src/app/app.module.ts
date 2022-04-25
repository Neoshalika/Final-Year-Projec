import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {DeductionUpdateSubFormComponent} from './views/modules/salary/salary-update-form/deduction-update-sub-form/deduction-update-sub-form.component';
import {CustomerorderproductUpdateSubFormComponent} from './views/modules/customerorder/customerorder-update-form/customerorderproduct-update-sub-form/customerorderproduct-update-sub-form.component';
import {PrmaterialreturnmaterialSubFormComponent} from './views/modules/prmaterialreturn/prmaterialreturn-form/prmaterialreturnmaterial-sub-form/prmaterialreturnmaterial-sub-form.component';
import {ProductmaterialUpdateSubFormComponent} from './views/modules/product/product-update-form/productmaterial-update-sub-form/productmaterial-update-sub-form.component';
import {CustomerpaymentTableComponent} from './views/modules/customerpayment/customerpayment-table/customerpayment-table.component';
import {CustomerpaymentFormComponent} from './views/modules/customerpayment/customerpayment-form/customerpayment-form.component';
import {CustomerpaymentDetailComponent} from './views/modules/customerpayment/customerpayment-detail/customerpayment-detail.component';
import {CustomerpaymentUpdateFormComponent} from './views/modules/customerpayment/customerpayment-update-form/customerpayment-update-form.component';
import {CustomorderrefunditemUpdateSubFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customorderrefunditem-update-sub-form/customorderrefunditem-update-sub-form.component';
import {SupplierrefundmaterialUpdateSubFormComponent} from './views/modules/supplierrefund/supplierrefund-update-form/supplierrefundmaterial-update-sub-form/supplierrefundmaterial-update-sub-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {SalaryTableComponent} from './views/modules/salary/salary-table/salary-table.component';
import {SalaryFormComponent} from './views/modules/salary/salary-form/salary-form.component';
import {SalaryDetailComponent} from './views/modules/salary/salary-detail/salary-detail.component';
import {SalaryUpdateFormComponent} from './views/modules/salary/salary-update-form/salary-update-form.component';
import {AdvancedpaymentTableComponent} from './views/modules/advancedpayment/advancedpayment-table/advancedpayment-table.component';
import {AdvancedpaymentFormComponent} from './views/modules/advancedpayment/advancedpayment-form/advancedpayment-form.component';
import {AdvancedpaymentDetailComponent} from './views/modules/advancedpayment/advancedpayment-detail/advancedpayment-detail.component';
import {AdvancedpaymentUpdateFormComponent} from './views/modules/advancedpayment/advancedpayment-update-form/advancedpayment-update-form.component';
import {CustomerorderproductSubFormComponent} from './views/modules/customerorder/customerorder-form/customerorderproduct-sub-form/customerorderproduct-sub-form.component';
import {PurchasematerialSubFormComponent} from './views/modules/purchase/purchase-form/purchasematerial-sub-form/purchasematerial-sub-form.component';
import {AllowanceUpdateSubFormComponent} from './views/modules/salary/salary-update-form/allowance-update-sub-form/allowance-update-sub-form.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {ProductsubcategoryTableComponent} from './views/modules/productsubcategory/productsubcategory-table/productsubcategory-table.component';
import {ProductsubcategoryFormComponent} from './views/modules/productsubcategory/productsubcategory-form/productsubcategory-form.component';
import {ProductsubcategoryDetailComponent} from './views/modules/productsubcategory/productsubcategory-detail/productsubcategory-detail.component';
import {ProductsubcategoryUpdateFormComponent} from './views/modules/productsubcategory/productsubcategory-update-form/productsubcategory-update-form.component';
import {ProrderTableComponent} from './views/modules/prorder/prorder-table/prorder-table.component';
import {ProrderFormComponent} from './views/modules/prorder/prorder-form/prorder-form.component';
import {ProrderDetailComponent} from './views/modules/prorder/prorder-detail/prorder-detail.component';
import {ProrderUpdateFormComponent} from './views/modules/prorder/prorder-update-form/prorder-update-form.component';
import {ProductdisposalproductUpdateSubFormComponent} from './views/modules/productdisposal/productdisposal-update-form/productdisposalproduct-update-sub-form/productdisposalproduct-update-sub-form.component';
import {CustomorderitemTableComponent} from './views/modules/customorderitem/customorderitem-table/customorderitem-table.component';
import {CustomorderitemFormComponent} from './views/modules/customorderitem/customorderitem-form/customorderitem-form.component';
import {CustomorderitemDetailComponent} from './views/modules/customorderitem/customorderitem-detail/customorderitem-detail.component';
import {CustomorderitemUpdateFormComponent} from './views/modules/customorderitem/customorderitem-update-form/customorderitem-update-form.component';
import {PordermaterialSubFormComponent} from './views/modules/porder/porder-form/pordermaterial-sub-form/pordermaterial-sub-form.component';
import {ProductmaterialSubFormComponent} from './views/modules/product/product-form/productmaterial-sub-form/productmaterial-sub-form.component';
import {MaterialsubcategoryTableComponent} from './views/modules/materialsubcategory/materialsubcategory-table/materialsubcategory-table.component';
import {MaterialsubcategoryFormComponent} from './views/modules/materialsubcategory/materialsubcategory-form/materialsubcategory-form.component';
import {MaterialsubcategoryDetailComponent} from './views/modules/materialsubcategory/materialsubcategory-detail/materialsubcategory-detail.component';
import {MaterialsubcategoryUpdateFormComponent} from './views/modules/materialsubcategory/materialsubcategory-update-form/materialsubcategory-update-form.component';
import {CustomerorderTableComponent} from './views/modules/customerorder/customerorder-table/customerorder-table.component';
import {CustomerorderFormComponent} from './views/modules/customerorder/customerorder-form/customerorder-form.component';
import {CustomerorderDetailComponent} from './views/modules/customerorder/customerorder-detail/customerorder-detail.component';
import {CustomerorderUpdateFormComponent} from './views/modules/customerorder/customerorder-update-form/customerorder-update-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
import {ProductdisposalproductSubFormComponent} from './views/modules/productdisposal/productdisposal-form/productdisposalproduct-sub-form/productdisposalproduct-sub-form.component';
import {MaterialdisposalmaterialUpdateSubFormComponent} from './views/modules/materialdisposal/materialdisposal-update-form/materialdisposalmaterial-update-sub-form/materialdisposalmaterial-update-sub-form.component';
import {SupplierreturnmaterialSubFormComponent} from './views/modules/supplierreturn/supplierreturn-form/supplierreturnmaterial-sub-form/supplierreturnmaterial-sub-form.component';
import {SupplierrefundTableComponent} from './views/modules/supplierrefund/supplierrefund-table/supplierrefund-table.component';
import {SupplierrefundFormComponent} from './views/modules/supplierrefund/supplierrefund-form/supplierrefund-form.component';
import {SupplierrefundDetailComponent} from './views/modules/supplierrefund/supplierrefund-detail/supplierrefund-detail.component';
import {SupplierrefundUpdateFormComponent} from './views/modules/supplierrefund/supplierrefund-update-form/supplierrefund-update-form.component';
import {CustomorderrefunditemSubFormComponent} from './views/modules/customerrefund/customerrefund-form/customorderrefunditem-sub-form/customorderrefunditem-sub-form.component';
import {MaterialdisposalmaterialSubFormComponent} from './views/modules/materialdisposal/materialdisposal-form/materialdisposalmaterial-sub-form/materialdisposalmaterial-sub-form.component';
import {LoanTableComponent} from './views/modules/loan/loan-table/loan-table.component';
import {LoanFormComponent} from './views/modules/loan/loan-form/loan-form.component';
import {LoanDetailComponent} from './views/modules/loan/loan-detail/loan-detail.component';
import {LoanUpdateFormComponent} from './views/modules/loan/loan-update-form/loan-update-form.component';
import {PrmaterialreturnTableComponent} from './views/modules/prmaterialreturn/prmaterialreturn-table/prmaterialreturn-table.component';
import {PrmaterialreturnFormComponent} from './views/modules/prmaterialreturn/prmaterialreturn-form/prmaterialreturn-form.component';
import {PrmaterialreturnDetailComponent} from './views/modules/prmaterialreturn/prmaterialreturn-detail/prmaterialreturn-detail.component';
import {PrmaterialreturnUpdateFormComponent} from './views/modules/prmaterialreturn/prmaterialreturn-update-form/prmaterialreturn-update-form.component';
import {ProductdisposalTableComponent} from './views/modules/productdisposal/productdisposal-table/productdisposal-table.component';
import {ProductdisposalFormComponent} from './views/modules/productdisposal/productdisposal-form/productdisposal-form.component';
import {ProductdisposalDetailComponent} from './views/modules/productdisposal/productdisposal-detail/productdisposal-detail.component';
import {ProductdisposalUpdateFormComponent} from './views/modules/productdisposal/productdisposal-update-form/productdisposal-update-form.component';
import {PordermaterialUpdateSubFormComponent} from './views/modules/porder/porder-update-form/pordermaterial-update-sub-form/pordermaterial-update-sub-form.component';
import {ProrderemployeeUpdateSubFormComponent} from './views/modules/prorder/prorder-update-form/prorderemployee-update-sub-form/prorderemployee-update-sub-form.component';
import {PrordermaterialUpdateSubFormComponent} from './views/modules/prorder/prorder-update-form/prordermaterial-update-sub-form/prordermaterial-update-sub-form.component';
import {ProrderemployeeSubFormComponent} from './views/modules/prorder/prorder-form/prorderemployee-sub-form/prorderemployee-sub-form.component';
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {MaterialdisposalTableComponent} from './views/modules/materialdisposal/materialdisposal-table/materialdisposal-table.component';
import {MaterialdisposalFormComponent} from './views/modules/materialdisposal/materialdisposal-form/materialdisposal-form.component';
import {MaterialdisposalDetailComponent} from './views/modules/materialdisposal/materialdisposal-detail/materialdisposal-detail.component';
import {MaterialdisposalUpdateFormComponent} from './views/modules/materialdisposal/materialdisposal-update-form/materialdisposal-update-form.component';
import {DeliveryTableComponent} from './views/modules/delivery/delivery-table/delivery-table.component';
import {DeliveryFormComponent} from './views/modules/delivery/delivery-form/delivery-form.component';
import {DeliveryDetailComponent} from './views/modules/delivery/delivery-detail/delivery-detail.component';
import {DeliveryUpdateFormComponent} from './views/modules/delivery/delivery-update-form/delivery-update-form.component';
import {ProductTableComponent} from './views/modules/product/product-table/product-table.component';
import {ProductFormComponent} from './views/modules/product/product-form/product-form.component';
import {ProductDetailComponent} from './views/modules/product/product-detail/product-detail.component';
import {ProductUpdateFormComponent} from './views/modules/product/product-update-form/product-update-form.component';
import {CustomerrefundTableComponent} from './views/modules/customerrefund/customerrefund-table/customerrefund-table.component';
import {CustomerrefundFormComponent} from './views/modules/customerrefund/customerrefund-form/customerrefund-form.component';
import {CustomerrefundDetailComponent} from './views/modules/customerrefund/customerrefund-detail/customerrefund-detail.component';
import {CustomerrefundUpdateFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customerrefund-update-form.component';
import {CustomerrefundproductSubFormComponent} from './views/modules/customerrefund/customerrefund-form/customerrefundproduct-sub-form/customerrefundproduct-sub-form.component';
import {PurchaseTableComponent} from './views/modules/purchase/purchase-table/purchase-table.component';
import {PurchaseFormComponent} from './views/modules/purchase/purchase-form/purchase-form.component';
import {PurchaseDetailComponent} from './views/modules/purchase/purchase-detail/purchase-detail.component';
import {PurchaseUpdateFormComponent} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import {DeductionSubFormComponent} from './views/modules/salary/salary-form/deduction-sub-form/deduction-sub-form.component';
import {PrmaterialreturnmaterialUpdateSubFormComponent} from './views/modules/prmaterialreturn/prmaterialreturn-update-form/prmaterialreturnmaterial-update-sub-form/prmaterialreturnmaterial-update-sub-form.component';
import {PrordermaterialSubFormComponent} from './views/modules/prorder/prorder-form/prordermaterial-sub-form/prordermaterial-sub-form.component';
import {PurchasematerialUpdateSubFormComponent} from './views/modules/purchase/purchase-update-form/purchasematerial-update-sub-form/purchasematerial-update-sub-form.component';
import {SupplierrefundmaterialSubFormComponent} from './views/modules/supplierrefund/supplierrefund-form/supplierrefundmaterial-sub-form/supplierrefundmaterial-sub-form.component';
import {LoanrepaymentTableComponent} from './views/modules/loanrepayment/loanrepayment-table/loanrepayment-table.component';
import {LoanrepaymentFormComponent} from './views/modules/loanrepayment/loanrepayment-form/loanrepayment-form.component';
import {LoanrepaymentDetailComponent} from './views/modules/loanrepayment/loanrepayment-detail/loanrepayment-detail.component';
import {LoanrepaymentUpdateFormComponent} from './views/modules/loanrepayment/loanrepayment-update-form/loanrepayment-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {AllowanceSubFormComponent} from './views/modules/salary/salary-form/allowance-sub-form/allowance-sub-form.component';
import {CustomerrefundproductUpdateSubFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customerrefundproduct-update-sub-form/customerrefundproduct-update-sub-form.component';
import {SalaryloanSubFormComponent} from './views/modules/salary/salary-form/salaryloan-sub-form/salaryloan-sub-form.component';
import {AttendanceTableComponent} from './views/modules/attendance/attendance-table/attendance-table.component';
import {AttendanceFormComponent} from './views/modules/attendance/attendance-form/attendance-form.component';
import {AttendanceDetailComponent} from './views/modules/attendance/attendance-detail/attendance-detail.component';
import {AttendanceUpdateFormComponent} from './views/modules/attendance/attendance-update-form/attendance-update-form.component';
import {SupplierreturnTableComponent} from './views/modules/supplierreturn/supplierreturn-table/supplierreturn-table.component';
import {SupplierreturnFormComponent} from './views/modules/supplierreturn/supplierreturn-form/supplierreturn-form.component';
import {SupplierreturnDetailComponent} from './views/modules/supplierreturn/supplierreturn-detail/supplierreturn-detail.component';
import {SupplierreturnUpdateFormComponent} from './views/modules/supplierreturn/supplierreturn-update-form/supplierreturn-update-form.component';
import {CustomerTableComponent} from './views/modules/customer/customer-table/customer-table.component';
import {CustomerFormComponent} from './views/modules/customer/customer-form/customer-form.component';
import {CustomerDetailComponent} from './views/modules/customer/customer-detail/customer-detail.component';
import {CustomerUpdateFormComponent} from './views/modules/customer/customer-update-form/customer-update-form.component';
import {SalaryloanUpdateSubFormComponent} from './views/modules/salary/salary-update-form/salaryloan-update-sub-form/salaryloan-update-sub-form.component';
import {SupplierreturnmaterialUpdateSubFormComponent} from './views/modules/supplierreturn/supplierreturn-update-form/supplierreturnmaterial-update-sub-form/supplierreturnmaterial-update-sub-form.component';
import { YearWiseEmployeeCountComponent } from './views/modules/reports/year-wise-employee-count/year-wise-employee-count.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {ChartsModule} from 'ng2-charts';
import { MonthWiseEmployeeCountComponent } from './views/modules/reports/month-wise-employee-count/month-wise-employee-count.component';
import { YearWisePurchaseCountComponent } from './views/modules/reports/year-wise-purchase-count/year-wise-purchase-count.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        DeductionUpdateSubFormComponent,
        CustomerorderproductUpdateSubFormComponent,
        PrmaterialreturnmaterialSubFormComponent,
        ProductmaterialUpdateSubFormComponent,
        CustomerpaymentTableComponent,
        CustomerpaymentFormComponent,
        CustomerpaymentDetailComponent,
        CustomerpaymentUpdateFormComponent,
        CustomorderrefunditemUpdateSubFormComponent,
        SupplierrefundmaterialUpdateSubFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        SalaryTableComponent,
        SalaryFormComponent,
        SalaryDetailComponent,
        SalaryUpdateFormComponent,
        AdvancedpaymentTableComponent,
        AdvancedpaymentFormComponent,
        AdvancedpaymentDetailComponent,
        AdvancedpaymentUpdateFormComponent,
        CustomerorderproductSubFormComponent,
        PurchasematerialSubFormComponent,
        AllowanceUpdateSubFormComponent,
        SupplierTableComponent,
        SupplierFormComponent,
        SupplierDetailComponent,
        SupplierUpdateFormComponent,
        ProductsubcategoryTableComponent,
        ProductsubcategoryFormComponent,
        ProductsubcategoryDetailComponent,
        ProductsubcategoryUpdateFormComponent,
        ProrderTableComponent,
        ProrderFormComponent,
        ProrderDetailComponent,
        ProrderUpdateFormComponent,
        ProductdisposalproductUpdateSubFormComponent,
        CustomorderitemTableComponent,
        CustomorderitemFormComponent,
        CustomorderitemDetailComponent,
        CustomorderitemUpdateFormComponent,
        PordermaterialSubFormComponent,
        ProductmaterialSubFormComponent,
        MaterialsubcategoryTableComponent,
        MaterialsubcategoryFormComponent,
        MaterialsubcategoryDetailComponent,
        MaterialsubcategoryUpdateFormComponent,
        CustomerorderTableComponent,
        CustomerorderFormComponent,
        CustomerorderDetailComponent,
        CustomerorderUpdateFormComponent,
        PorderTableComponent,
        PorderFormComponent,
        PorderDetailComponent,
        PorderUpdateFormComponent,
        ProductdisposalproductSubFormComponent,
        MaterialdisposalmaterialUpdateSubFormComponent,
        SupplierreturnmaterialSubFormComponent,
        SupplierrefundTableComponent,
        SupplierrefundFormComponent,
        SupplierrefundDetailComponent,
        SupplierrefundUpdateFormComponent,
        CustomorderrefunditemSubFormComponent,
        MaterialdisposalmaterialSubFormComponent,
        LoanTableComponent,
        LoanFormComponent,
        LoanDetailComponent,
        LoanUpdateFormComponent,
        PrmaterialreturnTableComponent,
        PrmaterialreturnFormComponent,
        PrmaterialreturnDetailComponent,
        PrmaterialreturnUpdateFormComponent,
        ProductdisposalTableComponent,
        ProductdisposalFormComponent,
        ProductdisposalDetailComponent,
        ProductdisposalUpdateFormComponent,
        PordermaterialUpdateSubFormComponent,
        ProrderemployeeUpdateSubFormComponent,
        PrordermaterialUpdateSubFormComponent,
        ProrderemployeeSubFormComponent,
        SupplierpaymentTableComponent,
        SupplierpaymentFormComponent,
        SupplierpaymentDetailComponent,
        SupplierpaymentUpdateFormComponent,
        VehicleTableComponent,
        VehicleFormComponent,
        VehicleDetailComponent,
        VehicleUpdateFormComponent,
        MaterialdisposalTableComponent,
        MaterialdisposalFormComponent,
        MaterialdisposalDetailComponent,
        MaterialdisposalUpdateFormComponent,
        DeliveryTableComponent,
        DeliveryFormComponent,
        DeliveryDetailComponent,
        DeliveryUpdateFormComponent,
        ProductTableComponent,
        ProductFormComponent,
        ProductDetailComponent,
        ProductUpdateFormComponent,
        CustomerrefundTableComponent,
        CustomerrefundFormComponent,
        CustomerrefundDetailComponent,
        CustomerrefundUpdateFormComponent,
        CustomerrefundproductSubFormComponent,
        PurchaseTableComponent,
        PurchaseFormComponent,
        PurchaseDetailComponent,
        PurchaseUpdateFormComponent,
        DeductionSubFormComponent,
        PrmaterialreturnmaterialUpdateSubFormComponent,
        PrordermaterialSubFormComponent,
        PurchasematerialUpdateSubFormComponent,
        SupplierrefundmaterialSubFormComponent,
        LoanrepaymentTableComponent,
        LoanrepaymentFormComponent,
        LoanrepaymentDetailComponent,
        LoanrepaymentUpdateFormComponent,
        MaterialTableComponent,
        MaterialFormComponent,
        MaterialDetailComponent,
        MaterialUpdateFormComponent,
        AllowanceSubFormComponent,
        CustomerrefundproductUpdateSubFormComponent,
        SalaryloanSubFormComponent,
        AttendanceTableComponent,
        AttendanceFormComponent,
        AttendanceDetailComponent,
        AttendanceUpdateFormComponent,
        SupplierreturnTableComponent,
        SupplierreturnFormComponent,
        SupplierreturnDetailComponent,
        SupplierreturnUpdateFormComponent,
        CustomerTableComponent,
        CustomerFormComponent,
        CustomerDetailComponent,
        CustomerUpdateFormComponent,
        SalaryloanUpdateSubFormComponent,
        SupplierreturnmaterialUpdateSubFormComponent,
        YearWiseEmployeeCountComponent,
        MonthWiseEmployeeCountComponent,
        YearWisePurchaseCountComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableExporterModule,
    ChartsModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

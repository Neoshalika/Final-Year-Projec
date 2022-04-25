import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
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
import {CustomerpaymentTableComponent} from './views/modules/customerpayment/customerpayment-table/customerpayment-table.component';
import {CustomerpaymentFormComponent} from './views/modules/customerpayment/customerpayment-form/customerpayment-form.component';
import {CustomerpaymentDetailComponent} from './views/modules/customerpayment/customerpayment-detail/customerpayment-detail.component';
import {CustomerpaymentUpdateFormComponent} from './views/modules/customerpayment/customerpayment-update-form/customerpayment-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {SalaryTableComponent} from './views/modules/salary/salary-table/salary-table.component';
import {SalaryFormComponent} from './views/modules/salary/salary-form/salary-form.component';
import {SalaryDetailComponent} from './views/modules/salary/salary-detail/salary-detail.component';
import {SalaryUpdateFormComponent} from './views/modules/salary/salary-update-form/salary-update-form.component';
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
import {AdvancedpaymentTableComponent} from './views/modules/advancedpayment/advancedpayment-table/advancedpayment-table.component';
import {AdvancedpaymentFormComponent} from './views/modules/advancedpayment/advancedpayment-form/advancedpayment-form.component';
import {AdvancedpaymentDetailComponent} from './views/modules/advancedpayment/advancedpayment-detail/advancedpayment-detail.component';
import {AdvancedpaymentUpdateFormComponent} from './views/modules/advancedpayment/advancedpayment-update-form/advancedpayment-update-form.component';
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
import {CustomorderitemTableComponent} from './views/modules/customorderitem/customorderitem-table/customorderitem-table.component';
import {CustomorderitemFormComponent} from './views/modules/customorderitem/customorderitem-form/customorderitem-form.component';
import {CustomorderitemDetailComponent} from './views/modules/customorderitem/customorderitem-detail/customorderitem-detail.component';
import {CustomorderitemUpdateFormComponent} from './views/modules/customorderitem/customorderitem-update-form/customorderitem-update-form.component';
import {PurchaseTableComponent} from './views/modules/purchase/purchase-table/purchase-table.component';
import {PurchaseFormComponent} from './views/modules/purchase/purchase-form/purchase-form.component';
import {PurchaseDetailComponent} from './views/modules/purchase/purchase-detail/purchase-detail.component';
import {PurchaseUpdateFormComponent} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
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
import {LoanrepaymentTableComponent} from './views/modules/loanrepayment/loanrepayment-table/loanrepayment-table.component';
import {LoanrepaymentFormComponent} from './views/modules/loanrepayment/loanrepayment-form/loanrepayment-form.component';
import {LoanrepaymentDetailComponent} from './views/modules/loanrepayment/loanrepayment-detail/loanrepayment-detail.component';
import {LoanrepaymentUpdateFormComponent} from './views/modules/loanrepayment/loanrepayment-update-form/loanrepayment-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {SupplierrefundTableComponent} from './views/modules/supplierrefund/supplierrefund-table/supplierrefund-table.component';
import {SupplierrefundFormComponent} from './views/modules/supplierrefund/supplierrefund-form/supplierrefund-form.component';
import {SupplierrefundDetailComponent} from './views/modules/supplierrefund/supplierrefund-detail/supplierrefund-detail.component';
import {SupplierrefundUpdateFormComponent} from './views/modules/supplierrefund/supplierrefund-update-form/supplierrefund-update-form.component';
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
import {YearWiseEmployeeCountComponent} from './views/modules/reports/year-wise-employee-count/year-wise-employee-count.component';
import {MonthWiseEmployeeCountComponent} from './views/modules/reports/month-wise-employee-count/month-wise-employee-count.component';
import {YearWisePurchaseCountComponent} from "./views/modules/reports/year-wise-purchase-count/year-wise-purchase-count.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'loans', component: LoanTableComponent},
      {path: 'loans/add', component: LoanFormComponent},
      {path: 'loans/:id', component: LoanDetailComponent},
      {path: 'loans/edit/:id', component: LoanUpdateFormComponent},

      {path: 'prmaterialreturns', component: PrmaterialreturnTableComponent},
      {path: 'prmaterialreturns/add', component: PrmaterialreturnFormComponent},
      {path: 'prmaterialreturns/:id', component: PrmaterialreturnDetailComponent},
      {path: 'prmaterialreturns/edit/:id', component: PrmaterialreturnUpdateFormComponent},

      {path: 'productdisposals', component: ProductdisposalTableComponent},
      {path: 'productdisposals/add', component: ProductdisposalFormComponent},
      {path: 'productdisposals/:id', component: ProductdisposalDetailComponent},
      {path: 'productdisposals/edit/:id', component: ProductdisposalUpdateFormComponent},

      {path: 'customerpayments', component: CustomerpaymentTableComponent},
      {path: 'customerpayments/add', component: CustomerpaymentFormComponent},
      {path: 'customerpayments/:id', component: CustomerpaymentDetailComponent},
      {path: 'customerpayments/edit/:id', component: CustomerpaymentUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'salaries', component: SalaryTableComponent},
      {path: 'salaries/add', component: SalaryFormComponent},
      {path: 'salaries/:id', component: SalaryDetailComponent},
      {path: 'salaries/edit/:id', component: SalaryUpdateFormComponent},

      {path: 'supplierpayments', component: SupplierpaymentTableComponent},
      {path: 'supplierpayments/add', component: SupplierpaymentFormComponent},
      {path: 'supplierpayments/:id', component: SupplierpaymentDetailComponent},
      {path: 'supplierpayments/edit/:id', component: SupplierpaymentUpdateFormComponent},

      {path: 'vehicles', component: VehicleTableComponent},
      {path: 'vehicles/add', component: VehicleFormComponent},
      {path: 'vehicles/:id', component: VehicleDetailComponent},
      {path: 'vehicles/edit/:id', component: VehicleUpdateFormComponent},

      {path: 'materialdisposals', component: MaterialdisposalTableComponent},
      {path: 'materialdisposals/add', component: MaterialdisposalFormComponent},
      {path: 'materialdisposals/:id', component: MaterialdisposalDetailComponent},
      {path: 'materialdisposals/edit/:id', component: MaterialdisposalUpdateFormComponent},

      {path: 'advancedpayments', component: AdvancedpaymentTableComponent},
      {path: 'advancedpayments/add', component: AdvancedpaymentFormComponent},
      {path: 'advancedpayments/:id', component: AdvancedpaymentDetailComponent},
      {path: 'advancedpayments/edit/:id', component: AdvancedpaymentUpdateFormComponent},

      {path: 'suppliers', component: SupplierTableComponent},
      {path: 'suppliers/add', component: SupplierFormComponent},
      {path: 'suppliers/:id', component: SupplierDetailComponent},
      {path: 'suppliers/edit/:id', component: SupplierUpdateFormComponent},

      {path: 'productsubcategories', component: ProductsubcategoryTableComponent},
      {path: 'productsubcategories/add', component: ProductsubcategoryFormComponent},
      {path: 'productsubcategories/:id', component: ProductsubcategoryDetailComponent},
      {path: 'productsubcategories/edit/:id', component: ProductsubcategoryUpdateFormComponent},

      {path: 'prorders', component: ProrderTableComponent},
      {path: 'prorders/add', component: ProrderFormComponent},
      {path: 'prorders/:id', component: ProrderDetailComponent},
      {path: 'prorders/edit/:id', component: ProrderUpdateFormComponent},

      {path: 'deliveries', component: DeliveryTableComponent},
      {path: 'deliveries/add', component: DeliveryFormComponent},
      {path: 'deliveries/:id', component: DeliveryDetailComponent},
      {path: 'deliveries/edit/:id', component: DeliveryUpdateFormComponent},

      {path: 'products', component: ProductTableComponent},
      {path: 'products/add', component: ProductFormComponent},
      {path: 'products/:id', component: ProductDetailComponent},
      {path: 'products/edit/:id', component: ProductUpdateFormComponent},

      {path: 'customerrefunds', component: CustomerrefundTableComponent},
      {path: 'customerrefunds/add', component: CustomerrefundFormComponent},
      {path: 'customerrefunds/:id', component: CustomerrefundDetailComponent},
      {path: 'customerrefunds/edit/:id', component: CustomerrefundUpdateFormComponent},

      {path: 'customorderitems', component: CustomorderitemTableComponent},
      {path: 'customorderitems/add', component: CustomorderitemFormComponent},
      {path: 'customorderitems/:id', component: CustomorderitemDetailComponent},
      {path: 'customorderitems/edit/:id', component: CustomorderitemUpdateFormComponent},

      {path: 'purchases', component: PurchaseTableComponent},
      {path: 'purchases/add', component: PurchaseFormComponent},
      {path: 'purchases/:id', component: PurchaseDetailComponent},
      {path: 'purchases/edit/:id', component: PurchaseUpdateFormComponent},

      {path: 'materialsubcategories', component: MaterialsubcategoryTableComponent},
      {path: 'materialsubcategories/add', component: MaterialsubcategoryFormComponent},
      {path: 'materialsubcategories/:id', component: MaterialsubcategoryDetailComponent},
      {path: 'materialsubcategories/edit/:id', component: MaterialsubcategoryUpdateFormComponent},

      {path: 'customerorders', component: CustomerorderTableComponent},
      {path: 'customerorders/add', component: CustomerorderFormComponent},
      {path: 'customerorders/:id', component: CustomerorderDetailComponent},
      {path: 'customerorders/edit/:id', component: CustomerorderUpdateFormComponent},

      {path: 'porders', component: PorderTableComponent},
      {path: 'porders/add', component: PorderFormComponent},
      {path: 'porders/:id', component: PorderDetailComponent},
      {path: 'porders/edit/:id', component: PorderUpdateFormComponent},

      {path: 'loanrepayments', component: LoanrepaymentTableComponent},
      {path: 'loanrepayments/add', component: LoanrepaymentFormComponent},
      {path: 'loanrepayments/:id', component: LoanrepaymentDetailComponent},
      {path: 'loanrepayments/edit/:id', component: LoanrepaymentUpdateFormComponent},

      {path: 'materials', component: MaterialTableComponent},
      {path: 'materials/add', component: MaterialFormComponent},
      {path: 'materials/:id', component: MaterialDetailComponent},
      {path: 'materials/edit/:id', component: MaterialUpdateFormComponent},

      {path: 'supplierrefunds', component: SupplierrefundTableComponent},
      {path: 'supplierrefunds/add', component: SupplierrefundFormComponent},
      {path: 'supplierrefunds/:id', component: SupplierrefundDetailComponent},
      {path: 'supplierrefunds/edit/:id', component: SupplierrefundUpdateFormComponent},

      {path: 'attendances', component: AttendanceTableComponent},
      {path: 'attendances/add', component: AttendanceFormComponent},
      {path: 'attendances/:id', component: AttendanceDetailComponent},
      {path: 'attendances/edit/:id', component: AttendanceUpdateFormComponent},

      {path: 'supplierreturns', component: SupplierreturnTableComponent},
      {path: 'supplierreturns/add', component: SupplierreturnFormComponent},
      {path: 'supplierreturns/:id', component: SupplierreturnDetailComponent},
      {path: 'supplierreturns/edit/:id', component: SupplierreturnUpdateFormComponent},

      {path: 'customers', component: CustomerTableComponent},
      {path: 'customers/add', component: CustomerFormComponent},
      {path: 'customers/:id', component: CustomerDetailComponent},
      {path: 'customers/edit/:id', component: CustomerUpdateFormComponent},

      {path: 'reports/year-wise-employee-count', component: YearWiseEmployeeCountComponent},
      {path: 'reports/year-wise-purchase-count', component: YearWisePurchaseCountComponent},
      {path: 'reports/month-wise-employee-count', component: MonthWiseEmployeeCountComponent},

      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

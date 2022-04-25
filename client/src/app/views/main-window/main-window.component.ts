import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');

    const customerLink = new LinkItem('Customer Management', '/', 'people');
    const customerrefundLink = new LinkItem('Customer Refund', '/', 'exit_to_app');
    const customerorderLink = new LinkItem('Customer Order', '/', 'menu_book');
    const customerpaymentLink = new LinkItem('Customer Payment', '/', 'price_change');

    const employeeLink = new LinkItem('Employee Management', '/', 'trip_origin');
    const attendanceLink = new LinkItem('Attendance ', '/', 'done');
    const advancedpaymentLink = new LinkItem('Advanced Payment ', '/', 'request_quote');
    const loanLink = new LinkItem('Loan ', '/', 'attach_money');
    const loanrepaymentLink = new LinkItem('Loan Repayment ', '/', 'pending');
    const salaryLink = new LinkItem('Salary ', '/', 'money');

    const supplierLink = new LinkItem('Supplier Management', '/', 'library_add');
    const supplierrefundLink = new LinkItem('Supplier Refund ', '/', 'forward');
    const supplierreturnLink = new LinkItem('Supplier Return ', '/', 'fast_rewind');
    const supplierpaymentLink = new LinkItem('Supplier Payment ', '/', 'checklist');

    const purchaseLink = new LinkItem('Purchase Management', '/', 'inventory');
    const porderLink = new LinkItem('Purchase Order ', '/', 'event_seat');

    const customorderitemLink = new LinkItem('Custom Order Item', '/', 'format_strikethrough');

    const materialLink = new LinkItem('Material Management ', '/', 'file_copy');
    const materialsubcategoryLink = new LinkItem('Material Sub Category ', '/', 'content_paste');
    const materialdisposalLink = new LinkItem('Material Disposal ', '/', 'delete_forever');

    const prorderLink = new LinkItem('Production Order Management', '/', 'construction');
    const prmaterialreturnLink = new LinkItem('Production Material Return ', '/', 'Undo');

    const productLink = new LinkItem('Product Management ', '/', 'king_bed');
    const productdisposalLink = new LinkItem('Product Disposal ', '/', 'delete_forever');
    const productsubcategoryLink = new LinkItem('Product Sub Category ', '/', 'post_add');

    const vehicleLink = new LinkItem('Vehicle Management', '/', 'directions_car');
    const deliveryLink = new LinkItem('Delivery ', '/', 'local_shipping');

    const reportLink = new LinkItem('Reports', '/', 'spellcheck');

    const showYearWiseEmployeeCountLink = new LinkItem('Show All year wise Employee Reports', '/reports/year-wise-employee-count/', 'assignment');
    showYearWiseEmployeeCountLink.addUsecaseId(UsecaseList.SHOW_YEAR_WISE_EMPLOYEE_COUNT);
    reportLink.children.push(showYearWiseEmployeeCountLink);

    const showYearWisePurchaseCountLink = new LinkItem('Show All year wise Purchase Reports', '/reports/year-wise-purchase-count/', 'assignment');
    showYearWisePurchaseCountLink.addUsecaseId(UsecaseList.SHOW_YEAR_WISE_PURCHASE_COUNT);
    reportLink.children.push(showYearWisePurchaseCountLink);

    const showMonthWiseEmployeeCountLink = new LinkItem('Show All month wise Employee Reports', '/reports/month-wise-employee-count/', 'assignment');
    showMonthWiseEmployeeCountLink.addUsecaseId(UsecaseList.SHOW_MONTH_WISE_EMPLOYEE_COUNT);
    reportLink.children.push(showMonthWiseEmployeeCountLink);

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewSalaryLink = new LinkItem('Add New Salary', 'salaries/add', 'add');
    addNewSalaryLink.addUsecaseId(UsecaseList.ADD_SALARY);
    salaryLink.children.push(addNewSalaryLink);

    const showAllSalaryLink = new LinkItem('Show All Salary', 'salaries', 'list');
    showAllSalaryLink.addUsecaseId(UsecaseList.SHOW_ALL_SALARIES);
    salaryLink.children.push(showAllSalaryLink);

    const addNewCustomerLink = new LinkItem('Add New Customer', 'customers/add', 'add');
    addNewCustomerLink.addUsecaseId(UsecaseList.ADD_CUSTOMER);
    customerLink.children.push(addNewCustomerLink);

    const showAllCustomerLink = new LinkItem('Show All Customer', 'customers', 'list');
    showAllCustomerLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERS);
    customerLink.children.push(showAllCustomerLink);

    const addNewMaterialsubcategoryLink = new LinkItem('Add New Materialsubcategory', 'materialsubcategories/add', 'add');
    addNewMaterialsubcategoryLink.addUsecaseId(UsecaseList.ADD_MATERIALSUBCATEGORY);
    materialsubcategoryLink.children.push(addNewMaterialsubcategoryLink);

    const showAllMaterialsubcategoryLink = new LinkItem('Show All Materialsubcategory', 'materialsubcategories', 'list');
    showAllMaterialsubcategoryLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALSUBCATEGORIES);
    materialsubcategoryLink.children.push(showAllMaterialsubcategoryLink);

    const addNewProductLink = new LinkItem('Add New Product', 'products/add', 'add');
    addNewProductLink.addUsecaseId(UsecaseList.ADD_PRODUCT);
    productLink.children.push(addNewProductLink);

    const showAllProductLink = new LinkItem('Show All Product', 'products', 'list');
    showAllProductLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTS);
    productLink.children.push(showAllProductLink);

    const addNewCustomerrefundLink = new LinkItem('Add New Customerrefund', 'customerrefunds/add', 'add');
    addNewCustomerrefundLink.addUsecaseId(UsecaseList.ADD_CUSTOMERREFUND);
    customerrefundLink.children.push(addNewCustomerrefundLink);

    const showAllCustomerrefundLink = new LinkItem('Show All Customerrefund', 'customerrefunds', 'list');
    showAllCustomerrefundLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERREFUNDS);
    customerrefundLink.children.push(showAllCustomerrefundLink);

    const addNewAdvancedpaymentLink = new LinkItem('Add New Advancedpayment', 'advancedpayments/add', 'add');
    addNewAdvancedpaymentLink.addUsecaseId(UsecaseList.ADD_ADVANCEDPAYMENT);
    advancedpaymentLink.children.push(addNewAdvancedpaymentLink);

    const showAllAdvancedpaymentLink = new LinkItem('Show All Advancedpayment', 'advancedpayments', 'list');
    showAllAdvancedpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_ADVANCEDPAYMENTS);
    advancedpaymentLink.children.push(showAllAdvancedpaymentLink);

    const addNewVehicleLink = new LinkItem('Add New Vehicle', 'vehicles/add', 'add');
    addNewVehicleLink.addUsecaseId(UsecaseList.ADD_VEHICLE);
    vehicleLink.children.push(addNewVehicleLink);

    const showAllVehicleLink = new LinkItem('Show All Vehicle', 'vehicles', 'list');
    showAllVehicleLink.addUsecaseId(UsecaseList.SHOW_ALL_VEHICLES);
    vehicleLink.children.push(showAllVehicleLink);

    const addNewSupplierpaymentLink = new LinkItem('Add New Supplierpayment', 'supplierpayments/add', 'add');
    addNewSupplierpaymentLink.addUsecaseId(UsecaseList.ADD_SUPPLIERPAYMENT);
    supplierpaymentLink.children.push(addNewSupplierpaymentLink);

    const showAllSupplierpaymentLink = new LinkItem('Show All Supplierpayment', 'supplierpayments', 'list');
    showAllSupplierpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    supplierpaymentLink.children.push(showAllSupplierpaymentLink);

    const addNewSupplierreturnLink = new LinkItem('Add New Supplierreturn', 'supplierreturns/add', 'add');
    addNewSupplierreturnLink.addUsecaseId(UsecaseList.ADD_SUPPLIERRETURN);
    supplierreturnLink.children.push(addNewSupplierreturnLink);

    const showAllSupplierreturnLink = new LinkItem('Show All Supplierreturn', 'supplierreturns', 'list');
    showAllSupplierreturnLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    supplierreturnLink.children.push(showAllSupplierreturnLink);

    const addNewSupplierLink = new LinkItem('Add New Supplier', 'suppliers/add', 'add');
    addNewSupplierLink.addUsecaseId(UsecaseList.ADD_SUPPLIER);
    supplierLink.children.push(addNewSupplierLink);

    const showAllSupplierLink = new LinkItem('Show All Supplier', 'suppliers', 'list');
    showAllSupplierLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERS);
    supplierLink.children.push(showAllSupplierLink);

    const addNewAttendanceLink = new LinkItem('Add New Attendance', 'attendances/add', 'add');
    addNewAttendanceLink.addUsecaseId(UsecaseList.ADD_ATTENDANCE);
    attendanceLink.children.push(addNewAttendanceLink);

    const showAllAttendanceLink = new LinkItem('Show All Attendance', 'attendances', 'list');
    showAllAttendanceLink.addUsecaseId(UsecaseList.SHOW_ALL_ATTENDANCES);
    attendanceLink.children.push(showAllAttendanceLink);

    const addNewProrderLink = new LinkItem('Add New Prorder', 'prorders/add', 'add');
    addNewProrderLink.addUsecaseId(UsecaseList.ADD_PRORDER);
    prorderLink.children.push(addNewProrderLink);

    const showAllProrderLink = new LinkItem('Show All Prorder', 'prorders', 'list');
    showAllProrderLink.addUsecaseId(UsecaseList.SHOW_ALL_PRORDERS);
    prorderLink.children.push(showAllProrderLink);

    const addNewPurchaseLink = new LinkItem('Add New Purchase', 'purchases/add', 'add');
    addNewPurchaseLink.addUsecaseId(UsecaseList.ADD_PURCHASE);
    purchaseLink.children.push(addNewPurchaseLink);

    const showAllPurchaseLink = new LinkItem('Show All Purchase', 'purchases', 'list');
    showAllPurchaseLink.addUsecaseId(UsecaseList.SHOW_ALL_PURCHASES);
    purchaseLink.children.push(showAllPurchaseLink);

    const addNewPrmaterialreturnLink = new LinkItem('Add New Prmaterialreturn', 'prmaterialreturns/add', 'add');
    addNewPrmaterialreturnLink.addUsecaseId(UsecaseList.ADD_PRMATERIALRETURN);
    prmaterialreturnLink.children.push(addNewPrmaterialreturnLink);

    const showAllPrmaterialreturnLink = new LinkItem('Show All Prmaterialreturn', 'prmaterialreturns', 'list');
    showAllPrmaterialreturnLink.addUsecaseId(UsecaseList.SHOW_ALL_PRMATERIALRETURNS);
    prmaterialreturnLink.children.push(showAllPrmaterialreturnLink);

    const addNewSupplierrefundLink = new LinkItem('Add New Supplierrefund', 'supplierrefunds/add', 'add');
    addNewSupplierrefundLink.addUsecaseId(UsecaseList.ADD_SUPPLIERREFUND);
    supplierrefundLink.children.push(addNewSupplierrefundLink);

    const showAllSupplierrefundLink = new LinkItem('Show All Supplierrefund', 'supplierrefunds', 'list');
    showAllSupplierrefundLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERREFUNDS);
    supplierrefundLink.children.push(showAllSupplierrefundLink);

    const addNewCustomerorderLink = new LinkItem('Add New Customerorder', 'customerorders/add', 'add');
    addNewCustomerorderLink.addUsecaseId(UsecaseList.ADD_CUSTOMERORDER);
    customerorderLink.children.push(addNewCustomerorderLink);

    const showAllCustomerorderLink = new LinkItem('Show All Customerorder', 'customerorders', 'list');
    showAllCustomerorderLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERORDERS);
    customerorderLink.children.push(showAllCustomerorderLink);

    const addNewMaterialLink = new LinkItem('Add New Material', 'materials/add', 'add');
    addNewMaterialLink.addUsecaseId(UsecaseList.ADD_MATERIAL);
    materialLink.children.push(addNewMaterialLink);

    const showAllMaterialLink = new LinkItem('Show All Material', 'materials', 'list');
    showAllMaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALS);
    materialLink.children.push(showAllMaterialLink);

    const addNewPorderLink = new LinkItem('Add New Porder', 'porders/add', 'add');
    addNewPorderLink.addUsecaseId(UsecaseList.ADD_PORDER);
    porderLink.children.push(addNewPorderLink);

    const showAllPorderLink = new LinkItem('Show All Porder', 'porders', 'list');
    showAllPorderLink.addUsecaseId(UsecaseList.SHOW_ALL_PORDERS);
    porderLink.children.push(showAllPorderLink);

    const addNewLoanrepaymentLink = new LinkItem('Add New Loanrepayment', 'loanrepayments/add', 'add');
    addNewLoanrepaymentLink.addUsecaseId(UsecaseList.ADD_LOANREPAYMENT);
    loanrepaymentLink.children.push(addNewLoanrepaymentLink);

    const showAllLoanrepaymentLink = new LinkItem('Show All Loanrepayment', 'loanrepayments', 'list');
    showAllLoanrepaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_LOANREPAYMENTS);
    loanrepaymentLink.children.push(showAllLoanrepaymentLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewLoanLink = new LinkItem('Add New Loan', 'loans/add', 'add');
    addNewLoanLink.addUsecaseId(UsecaseList.ADD_LOAN);
    loanLink.children.push(addNewLoanLink);

    const showAllLoanLink = new LinkItem('Show All Loan', 'loans', 'list');
    showAllLoanLink.addUsecaseId(UsecaseList.SHOW_ALL_LOANS);
    loanLink.children.push(showAllLoanLink);

    const addNewProductsubcategoryLink = new LinkItem('Add New Productsubcategory', 'productsubcategories/add', 'add');
    addNewProductsubcategoryLink.addUsecaseId(UsecaseList.ADD_PRODUCTSUBCATEGORY);
    productsubcategoryLink.children.push(addNewProductsubcategoryLink);

    const showAllProductsubcategoryLink = new LinkItem('Show All Productsubcategory', 'productsubcategories', 'list');
    showAllProductsubcategoryLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTSUBCATEGORIES);
    productsubcategoryLink.children.push(showAllProductsubcategoryLink);

    const addNewCustomorderitemLink = new LinkItem('Add New Customorderitem', 'customorderitems/add', 'add');
    addNewCustomorderitemLink.addUsecaseId(UsecaseList.ADD_CUSTOMORDERITEM);
    customorderitemLink.children.push(addNewCustomorderitemLink);

    const showAllCustomorderitemLink = new LinkItem('Show All Customorderitem', 'customorderitems', 'list');
    showAllCustomorderitemLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMORDERITEMS);
    customorderitemLink.children.push(showAllCustomorderitemLink);

    const addNewMaterialdisposalLink = new LinkItem('Add New Materialdisposal', 'materialdisposals/add', 'add');
    addNewMaterialdisposalLink.addUsecaseId(UsecaseList.ADD_MATERIALDISPOSAL);
    materialdisposalLink.children.push(addNewMaterialdisposalLink);

    const showAllMaterialdisposalLink = new LinkItem('Show All Materialdisposal', 'materialdisposals', 'list');
    showAllMaterialdisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
    materialdisposalLink.children.push(showAllMaterialdisposalLink);

    const addNewProductdisposalLink = new LinkItem('Add New Productdisposal', 'productdisposals/add', 'add');
    addNewProductdisposalLink.addUsecaseId(UsecaseList.ADD_PRODUCTDISPOSAL);
    productdisposalLink.children.push(addNewProductdisposalLink);

    const showAllProductdisposalLink = new LinkItem('Show All Productdisposal', 'productdisposals', 'list');
    showAllProductdisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTDISPOSALS);
    productdisposalLink.children.push(showAllProductdisposalLink);

    const addNewDeliveryLink = new LinkItem('Add New Delivery', 'deliveries/add', 'add');
    addNewDeliveryLink.addUsecaseId(UsecaseList.ADD_DELIVERY);
    deliveryLink.children.push(addNewDeliveryLink);

    const showAllDeliveryLink = new LinkItem('Show All Delivery', 'deliveries', 'list');
    showAllDeliveryLink.addUsecaseId(UsecaseList.SHOW_ALL_DELIVERIES);
    deliveryLink.children.push(showAllDeliveryLink);

    const addNewCustomerpaymentLink = new LinkItem('Add New Customerpayment', 'customerpayments/add', 'add');
    addNewCustomerpaymentLink.addUsecaseId(UsecaseList.ADD_CUSTOMERPAYMENT);
    customerpaymentLink.children.push(addNewCustomerpaymentLink);

    const showAllCustomerpaymentLink = new LinkItem('Show All Customerpayment', 'customerpayments', 'list');
    showAllCustomerpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    customerpaymentLink.children.push(showAllCustomerpaymentLink);

    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);

    this.linkItems.push(employeeLink);
    employeeLink.children.push(attendanceLink);
    employeeLink.children.push(advancedpaymentLink);
    employeeLink.children.push(loanLink);
    employeeLink.children.push(loanrepaymentLink);
    employeeLink.children.push(salaryLink);

    this.linkItems.push(customerLink);
    customerLink.children.push(customerorderLink);
    customerLink.children.push(customerpaymentLink);
    customerLink.children.push(customerrefundLink);

    this.linkItems.push(materialLink);
    materialLink.children.push(materialsubcategoryLink);
    materialLink.children.push(materialdisposalLink);

    this.linkItems.push(productLink);
    productLink.children.push(productsubcategoryLink);
    productLink.children.push(productdisposalLink);

    this.linkItems.push(customorderitemLink);

    this.linkItems.push(prorderLink);
    prorderLink.children.push(prmaterialreturnLink);

    this.linkItems.push(purchaseLink);
    purchaseLink.children.push(porderLink);

    this.linkItems.push(supplierLink);
    supplierLink.children.push(supplierpaymentLink);
    supplierLink.children.push(supplierreturnLink);
    supplierLink.children.push(supplierrefundLink);

    this.linkItems.push(vehicleLink);
    vehicleLink.children.push(deliveryLink);

    this.linkItems.push(reportLink);



  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}

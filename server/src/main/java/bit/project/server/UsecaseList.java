package bit.project.server;

import bit.project.server.util.security.SystemModule;

public enum UsecaseList{
    @SystemModule("User") SHOW_ALL_USERS(1),
    @SystemModule("User") SHOW_USER_DETAILS(2),
    @SystemModule("User") ADD_USER(3),
    @SystemModule("User") UPDATE_USER(4),
    @SystemModule("User") DELETE_USER(5),
    @SystemModule("User") RESET_USER_PASSWORDS(6),
    @SystemModule("Role") SHOW_ALL_ROLES(7),
    @SystemModule("Role") SHOW_ROLE_DETAILS(8),
    @SystemModule("Role") ADD_ROLE(9),
    @SystemModule("Role") UPDATE_ROLE(10),
    @SystemModule("Role") DELETE_ROLE(11),
    @SystemModule("Advancedpayment") SHOW_ALL_ADVANCEDPAYMENTS(12),
    @SystemModule("Advancedpayment") SHOW_ADVANCEDPAYMENT_DETAILS(13),
    @SystemModule("Advancedpayment") ADD_ADVANCEDPAYMENT(14),
    @SystemModule("Advancedpayment") UPDATE_ADVANCEDPAYMENT(15),
    @SystemModule("Advancedpayment") DELETE_ADVANCEDPAYMENT(16),
    @SystemModule("Attendance") SHOW_ALL_ATTENDANCES(17),
    @SystemModule("Attendance") SHOW_ATTENDANCE_DETAILS(18),
    @SystemModule("Attendance") ADD_ATTENDANCE(19),
    @SystemModule("Attendance") UPDATE_ATTENDANCE(20),
    @SystemModule("Attendance") DELETE_ATTENDANCE(21),
    @SystemModule("Customer") SHOW_ALL_CUSTOMERS(22),
    @SystemModule("Customer") SHOW_CUSTOMER_DETAILS(23),
    @SystemModule("Customer") ADD_CUSTOMER(24),
    @SystemModule("Customer") UPDATE_CUSTOMER(25),
    @SystemModule("Customer") DELETE_CUSTOMER(26),
    @SystemModule("Customerorder") SHOW_ALL_CUSTOMERORDERS(27),
    @SystemModule("Customerorder") SHOW_CUSTOMERORDER_DETAILS(28),
    @SystemModule("Customerorder") ADD_CUSTOMERORDER(29),
    @SystemModule("Customerorder") UPDATE_CUSTOMERORDER(30),
    @SystemModule("Customerorder") DELETE_CUSTOMERORDER(31),
    @SystemModule("Customerpayment") SHOW_ALL_CUSTOMERPAYMENTS(32),
    @SystemModule("Customerpayment") SHOW_CUSTOMERPAYMENT_DETAILS(33),
    @SystemModule("Customerpayment") ADD_CUSTOMERPAYMENT(34),
    @SystemModule("Customerpayment") UPDATE_CUSTOMERPAYMENT(35),
    @SystemModule("Customerpayment") DELETE_CUSTOMERPAYMENT(36),
    @SystemModule("Customerrefund") SHOW_ALL_CUSTOMERREFUNDS(37),
    @SystemModule("Customerrefund") SHOW_CUSTOMERREFUND_DETAILS(38),
    @SystemModule("Customerrefund") ADD_CUSTOMERREFUND(39),
    @SystemModule("Customerrefund") UPDATE_CUSTOMERREFUND(40),
    @SystemModule("Customerrefund") DELETE_CUSTOMERREFUND(41),
    @SystemModule("Customorderitem") SHOW_ALL_CUSTOMORDERITEMS(42),
    @SystemModule("Customorderitem") SHOW_CUSTOMORDERITEM_DETAILS(43),
    @SystemModule("Customorderitem") ADD_CUSTOMORDERITEM(44),
    @SystemModule("Customorderitem") UPDATE_CUSTOMORDERITEM(45),
    @SystemModule("Customorderitem") DELETE_CUSTOMORDERITEM(46),
    @SystemModule("Delivery") SHOW_ALL_DELIVERIES(47),
    @SystemModule("Delivery") SHOW_DELIVERY_DETAILS(48),
    @SystemModule("Delivery") ADD_DELIVERY(49),
    @SystemModule("Delivery") UPDATE_DELIVERY(50),
    @SystemModule("Delivery") DELETE_DELIVERY(51),
    @SystemModule("Employee") SHOW_ALL_EMPLOYEES(52),
    @SystemModule("Employee") SHOW_EMPLOYEE_DETAILS(53),
    @SystemModule("Employee") ADD_EMPLOYEE(54),
    @SystemModule("Employee") UPDATE_EMPLOYEE(55),
    @SystemModule("Employee") DELETE_EMPLOYEE(56),
    @SystemModule("Loan") SHOW_ALL_LOANS(57),
    @SystemModule("Loan") SHOW_LOAN_DETAILS(58),
    @SystemModule("Loan") ADD_LOAN(59),
    @SystemModule("Loan") UPDATE_LOAN(60),
    @SystemModule("Loan") DELETE_LOAN(61),
    @SystemModule("Loanrepayment") SHOW_ALL_LOANREPAYMENTS(62),
    @SystemModule("Loanrepayment") SHOW_LOANREPAYMENT_DETAILS(63),
    @SystemModule("Loanrepayment") ADD_LOANREPAYMENT(64),
    @SystemModule("Loanrepayment") UPDATE_LOANREPAYMENT(65),
    @SystemModule("Loanrepayment") DELETE_LOANREPAYMENT(66),
    @SystemModule("Material") SHOW_ALL_MATERIALS(67),
    @SystemModule("Material") SHOW_MATERIAL_DETAILS(68),
    @SystemModule("Material") ADD_MATERIAL(69),
    @SystemModule("Material") UPDATE_MATERIAL(70),
    @SystemModule("Material") DELETE_MATERIAL(71),
    @SystemModule("Materialdisposal") SHOW_ALL_MATERIALDISPOSALS(72),
    @SystemModule("Materialdisposal") SHOW_MATERIALDISPOSAL_DETAILS(73),
    @SystemModule("Materialdisposal") ADD_MATERIALDISPOSAL(74),
    @SystemModule("Materialdisposal") UPDATE_MATERIALDISPOSAL(75),
    @SystemModule("Materialdisposal") DELETE_MATERIALDISPOSAL(76),
    @SystemModule("Materialsubcategory") SHOW_ALL_MATERIALSUBCATEGORIES(77),
    @SystemModule("Materialsubcategory") SHOW_MATERIALSUBCATEGORY_DETAILS(78),
    @SystemModule("Materialsubcategory") ADD_MATERIALSUBCATEGORY(79),
    @SystemModule("Materialsubcategory") UPDATE_MATERIALSUBCATEGORY(80),
    @SystemModule("Materialsubcategory") DELETE_MATERIALSUBCATEGORY(81),
    @SystemModule("Porder") SHOW_ALL_PORDERS(82),
    @SystemModule("Porder") SHOW_PORDER_DETAILS(83),
    @SystemModule("Porder") ADD_PORDER(84),
    @SystemModule("Porder") UPDATE_PORDER(85),
    @SystemModule("Porder") DELETE_PORDER(86),
    @SystemModule("Prmaterialreturn") SHOW_ALL_PRMATERIALRETURNS(87),
    @SystemModule("Prmaterialreturn") SHOW_PRMATERIALRETURN_DETAILS(88),
    @SystemModule("Prmaterialreturn") ADD_PRMATERIALRETURN(89),
    @SystemModule("Prmaterialreturn") UPDATE_PRMATERIALRETURN(90),
    @SystemModule("Prmaterialreturn") DELETE_PRMATERIALRETURN(91),
    @SystemModule("Product") SHOW_ALL_PRODUCTS(92),
    @SystemModule("Product") SHOW_PRODUCT_DETAILS(93),
    @SystemModule("Product") ADD_PRODUCT(94),
    @SystemModule("Product") UPDATE_PRODUCT(95),
    @SystemModule("Product") DELETE_PRODUCT(96),
    @SystemModule("Productdisposal") SHOW_ALL_PRODUCTDISPOSALS(97),
    @SystemModule("Productdisposal") SHOW_PRODUCTDISPOSAL_DETAILS(98),
    @SystemModule("Productdisposal") ADD_PRODUCTDISPOSAL(99),
    @SystemModule("Productdisposal") UPDATE_PRODUCTDISPOSAL(100),
    @SystemModule("Productdisposal") DELETE_PRODUCTDISPOSAL(101),
    @SystemModule("Productsubcategory") SHOW_ALL_PRODUCTSUBCATEGORIES(102),
    @SystemModule("Productsubcategory") SHOW_PRODUCTSUBCATEGORY_DETAILS(103),
    @SystemModule("Productsubcategory") ADD_PRODUCTSUBCATEGORY(104),
    @SystemModule("Productsubcategory") UPDATE_PRODUCTSUBCATEGORY(105),
    @SystemModule("Productsubcategory") DELETE_PRODUCTSUBCATEGORY(106),
    @SystemModule("Prorder") SHOW_ALL_PRORDERS(107),
    @SystemModule("Prorder") SHOW_PRORDER_DETAILS(108),
    @SystemModule("Prorder") ADD_PRORDER(109),
    @SystemModule("Prorder") UPDATE_PRORDER(110),
    @SystemModule("Prorder") DELETE_PRORDER(111),
    @SystemModule("Purchase") SHOW_ALL_PURCHASES(112),
    @SystemModule("Purchase") SHOW_PURCHASE_DETAILS(113),
    @SystemModule("Purchase") ADD_PURCHASE(114),
    @SystemModule("Purchase") UPDATE_PURCHASE(115),
    @SystemModule("Purchase") DELETE_PURCHASE(116),
    @SystemModule("Salary") SHOW_ALL_SALARIES(117),
    @SystemModule("Salary") SHOW_SALARY_DETAILS(118),
    @SystemModule("Salary") ADD_SALARY(119),
    @SystemModule("Salary") UPDATE_SALARY(120),
    @SystemModule("Salary") DELETE_SALARY(121),
    @SystemModule("Supplier") SHOW_ALL_SUPPLIERS(122),
    @SystemModule("Supplier") SHOW_SUPPLIER_DETAILS(123),
    @SystemModule("Supplier") ADD_SUPPLIER(124),
    @SystemModule("Supplier") UPDATE_SUPPLIER(125),
    @SystemModule("Supplier") DELETE_SUPPLIER(126),
    @SystemModule("Supplierpayment") SHOW_ALL_SUPPLIERPAYMENTS(127),
    @SystemModule("Supplierpayment") SHOW_SUPPLIERPAYMENT_DETAILS(128),
    @SystemModule("Supplierpayment") ADD_SUPPLIERPAYMENT(129),
    @SystemModule("Supplierpayment") UPDATE_SUPPLIERPAYMENT(130),
    @SystemModule("Supplierpayment") DELETE_SUPPLIERPAYMENT(131),
    @SystemModule("Supplierrefund") SHOW_ALL_SUPPLIERREFUNDS(132),
    @SystemModule("Supplierrefund") SHOW_SUPPLIERREFUND_DETAILS(133),
    @SystemModule("Supplierrefund") ADD_SUPPLIERREFUND(134),
    @SystemModule("Supplierrefund") UPDATE_SUPPLIERREFUND(135),
    @SystemModule("Supplierrefund") DELETE_SUPPLIERREFUND(136),
    @SystemModule("Supplierreturn") SHOW_ALL_SUPPLIERRETURNS(137),
    @SystemModule("Supplierreturn") SHOW_SUPPLIERRETURN_DETAILS(138),
    @SystemModule("Supplierreturn") ADD_SUPPLIERRETURN(139),
    @SystemModule("Supplierreturn") UPDATE_SUPPLIERRETURN(140),
    @SystemModule("Supplierreturn") DELETE_SUPPLIERRETURN(141),
    @SystemModule("Vehicle") SHOW_ALL_VEHICLES(142),
    @SystemModule("Vehicle") SHOW_VEHICLE_DETAILS(143),
    @SystemModule("Vehicle") ADD_VEHICLE(144),
    @SystemModule("Vehicle") UPDATE_VEHICLE(145),
    @SystemModule("Vehicle") DELETE_VEHICLE(146),
    @SystemModule("Report") SHOW_YEAR_WISE_EMPLOYEE_COUNT(147),
    @SystemModule("Report") SHOW_MONTH_WISE_EMPLOYEE_COUNT(148),
    @SystemModule("Report") SHOW_YEAR_WISE_PURCHASE_COUNT(149);

    public final int value;

    UsecaseList(int value){
        this.value = value;
    }

}
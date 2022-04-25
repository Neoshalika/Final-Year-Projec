-- drop database if exist
DROP DATABASE IF EXISTS `ranasinghawoodworks`;


-- create new database
CREATE DATABASE `ranasinghawoodworks`;
USE `ranasinghawoodworks`;


-- set max allowed packet size
set global max_allowed_packet = 64000000;


-- table definitions
CREATE TABLE `advancedpaymentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `civilstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `customerorderstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `deliverystatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `designation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `employeestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `gender`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `materialcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `materialstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `nametitle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `paymentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `paymenttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `productcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `productstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `prorderstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `supplierreturnstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `supplierstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `unit`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `vehiclestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `advancedpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `employee_id` INT NOT NULL,
    `advancedpaymentstatus_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `reason` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `attendance`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `employee_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `toin` TIME NOT NULL,
    `toout` TIME NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customer`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `primarycontact` CHAR(10) NOT NULL,
    `alternatecontact` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `fax` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerorderproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerorder_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(13,3) NULL
);

CREATE TABLE `customerorder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customer_id` INT NOT NULL,
    `customerorderstatus_id` INT NOT NULL,
    `doordered` DATE NOT NULL,
    `dorequired` DATE NOT NULL,
    `dofinished` DATE NULL,
    `dohandovered` DATE NULL,
    `discount` DECIMAL(10,2) NULL,
    `deliverycost` DECIMAL(10,2) NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customerorder_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerrefundproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerrefund_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(13,3) NULL
);

CREATE TABLE `customorderrefunditem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerrefund_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(13,3) NULL
);

CREATE TABLE `customerrefund`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customerorder_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customorderitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customerorder_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(13,3) NULL,
    `name` VARCHAR(255) NOT NULL,
    `document` CHAR(36) NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `deliveryemployee`(
    `delivery_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `delivery`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customerorder_id` INT NOT NULL,
    `vehicle_id` INT NOT NULL,
    `contactname` VARCHAR(255) NOT NULL,
    `contactno` VARCHAR(10) NOT NULL,
    `permitno` VARCHAR(10) NULL,
    `distance` INT(11) NULL,
    `deliverystatus_id` INT NOT NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `civilstatus_id` INT NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NULL,
    `designation_id` INT NOT NULL,
    `dorecruit` DATE NOT NULL,
    `employeestatus_id` INT NOT NULL,
    `dobirth` DATE NOT NULL,
    `gender_id` INT NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `mobile` VARCHAR(10) NOT NULL,
    `land` VARCHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `etfno` VARCHAR(255) NULL,
    `daysalary` DECIMAL(10,2) NOT NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `loan`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `employee_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `monthlyinstallment` DECIMAL(10,2) NULL,
    `balance` DECIMAL(10,2) NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `reason` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `loanrepayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `loan_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `material`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `materialsubcategory_id` INT NOT NULL,
    `unit_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `qty` DECIMAL(13,2) NOT NULL,
    `rop` DECIMAL(13,3) NULL,
    `lastprice` DECIMAL(10,2) NOT NULL,
    `materialstatus_id` INT NOT NULL,
    `more` VARCHAR(255) NULL,
    `photo` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `materialdisposalmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `materialdisposal_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NOT NULL
);

CREATE TABLE `materialdisposal`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `reason` TEXT NOT NULL,
    `date` DATE NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `materialsubcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `materialcategory_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `pordermaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `porder_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL
);

CREATE TABLE `porder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `supplier_id` INT NOT NULL,
    `doordered` DATE NOT NULL,
    `dorequired` DATE NOT NULL,
    `dorecived` DATE NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `prmaterialreturnmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prmaterialreturn_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL
);

CREATE TABLE `prmaterialreturn`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `prorder_id` INT NULL,
    `date` DATE NOT NULL,
    `reason` TEXT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `productmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL
);

CREATE TABLE `product`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `productstatus_id` INT NULL,
    `photo` CHAR(36) NULL,
    `qty` INT(11) NOT NULL,
    `unitprice` DECIMAL(10,2) NULL,
    `rpqty` DECIMAL(13,3) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `productdisposalproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `productdisposal_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `qty` INT(11) NULL
);

CREATE TABLE `productdisposal`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `reason` TEXT NULL,
    `date` DATE NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `productsubcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `productcategory_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `prordermaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prorder_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL
);

CREATE TABLE `prorderemployee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prorder_id` INT NOT NULL,
    `employee_id` INT NULL,
    `date` DATE NOT NULL,
    `tostart` TIME NULL,
    `toend` TIME NULL
);

CREATE TABLE `prorder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `customorderitem_id` INT NULL,
    `product_id` INT NULL,
    `qty` INT(11) NULL,
    `dostart` DATE NOT NULL,
    `deadline` DATE NULL,
    `doend` DATE NULL,
    `prorderstatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `purchasematerial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `purchase_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(13,3) NULL
);

CREATE TABLE `purchase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `supplier_id` INT NOT NULL,
    `porder_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `salaryadvancedpayment`(
    `salary_id` INT NOT NULL,
    `advancedpayment_id` INT NOT NULL
);

CREATE TABLE `allowance`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `salary_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(13,3) NOT NULL
);

CREATE TABLE `salaryloan`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `salary_id` INT NOT NULL,
    `loan_id` INT NOT NULL,
    `amount` DECIMAL(13,3) NOT NULL
);

CREATE TABLE `deduction`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `salary_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(13,3) NOT NULL
);

CREATE TABLE `salary`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `employee_id` INT NOT NULL,
    `month` DATE NOT NULL,
    `date` DATE NOT NULL,
    `epf` DECIMAL(10,2) NOT NULL,
    `etf` DECIMAL(10,2) NOT NULL,
    `grossincome` DECIMAL(10,2) NOT NULL,
    `netsalary` DECIMAL(10,1) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `suppliermaterialcategory`(
    `supplier_id` INT NOT NULL,
    `materialcategory_id` INT NOT NULL
);

CREATE TABLE `supplier`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `supplierstatus_id` INT NOT NULL,
    `email` VARCHAR(255) NULL,
    `fax` VARCHAR(255) NULL,
    `contact1` CHAR(10) NOT NULL,
    `contact2` CHAR(10) NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplierpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `purchase_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `amount` DECIMAL(10,2) NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplierrefundmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `supplierrefund_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL,
    `unitprice` DECIMAL(10,2) NULL
);

CREATE TABLE `supplierrefund`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `purchase_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplierreturnmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `supplierreturn_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(13,3) NULL
);

CREATE TABLE `supplierreturn`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `purchase_id` INT NULL,
    `supplierreturnstatus_id` INT NULL,
    `doreturned` DATE NOT NULL,
    `dorecived` DATE NULL,
    `reason` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `vehicle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `no` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL,
    `modal` VARCHAR(255) NOT NULL,
    `vehiclestatus_id` INT NOT NULL,
    `photo` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `tocreation` DATETIME NULL,
    `tolocked` DATETIME NULL,
    `failedattempts` INT NULL DEFAULT 0,
    `creator_id` INT NULL,
    `photo` CHAR(36) NULL,
    `employee_id` INT NULL
);

CREATE TABLE `userrole`(
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL
);

CREATE TABLE `role`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `systemmodule`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `usecase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `task` VARCHAR(255) NOT NULL,
    `systemmodule_id` INT NOT NULL
);

CREATE TABLE `roleusecase`(
    `role_id` INT NOT NULL,
    `usecase_id` INT NOT NULL
);

CREATE TABLE `notification`(
    `id` CHAR(36) NOT NULL,
    `dosend` DATETIME NOT NULL,
    `dodelivered` DATETIME NULL,
    `doread` DATETIME NULL,
    `message` TEXT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `token`(
    `id` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `toexpiration` DATETIME NULL,
    `ip` VARCHAR(100) NULL,
    `status` VARCHAR(20) NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `servicelog`(
    `id` CHAR(36) NOT NULL,
    `method` VARCHAR(10) NULL,
    `responsecode` INT NULL,
    `ip` VARCHAR(100) NULL,
    `torequest` DATETIME NULL,
    `url` TEXT NULL,
    `handler` VARCHAR(255) NULL,
    `token_id` CHAR(36) NULL
);

CREATE TABLE `file`(
    `id` CHAR(36) NOT NULL,
    `file` MEDIUMBLOB NULL,
    `thumbnail` MEDIUMBLOB NULL,
    `filemimetype` VARCHAR(255) NULL,
    `thumbnailmimetype` VARCHAR(255) NULL,
    `filesize` INT NULL,
    `originalname` VARCHAR(255) NULL,
    `tocreation` DATETIME NULL,
    `isused` TINYINT NULL DEFAULT 0
);



-- primary key definitions
ALTER TABLE `deliveryemployee` ADD CONSTRAINT pk_deliveryemployee PRIMARY KEY (`delivery_id`,`employee_id`);
ALTER TABLE `salaryadvancedpayment` ADD CONSTRAINT pk_salaryadvancedpayment PRIMARY KEY (`salary_id`,`advancedpayment_id`);
ALTER TABLE `suppliermaterialcategory` ADD CONSTRAINT pk_suppliermaterialcategory PRIMARY KEY (`supplier_id`,`materialcategory_id`);
ALTER TABLE `userrole` ADD CONSTRAINT pk_userrole PRIMARY KEY (`user_id`,`role_id`);
ALTER TABLE `roleusecase` ADD CONSTRAINT pk_roleusecase PRIMARY KEY (`role_id`,`usecase_id`);
ALTER TABLE `notification` ADD CONSTRAINT pk_notification PRIMARY KEY (`id`);
ALTER TABLE `token` ADD CONSTRAINT pk_token PRIMARY KEY (`id`);
ALTER TABLE `servicelog` ADD CONSTRAINT pk_servicelog PRIMARY KEY (`id`);
ALTER TABLE `file` ADD CONSTRAINT pk_file PRIMARY KEY (`id`);


-- unique key definitions
ALTER TABLE `advancedpayment` ADD CONSTRAINT unique_advancedpayment_code UNIQUE (`code`);
ALTER TABLE `attendance` ADD CONSTRAINT unique_attendance_code UNIQUE (`code`);
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_code UNIQUE (`code`);
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_email UNIQUE (`email`);
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_fax UNIQUE (`fax`);
ALTER TABLE `customerorder` ADD CONSTRAINT unique_customerorder_code UNIQUE (`code`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_code UNIQUE (`code`);
ALTER TABLE `customerrefund` ADD CONSTRAINT unique_customerrefund_code UNIQUE (`code`);
ALTER TABLE `customorderitem` ADD CONSTRAINT unique_customorderitem_code UNIQUE (`code`);
ALTER TABLE `delivery` ADD CONSTRAINT unique_delivery_code UNIQUE (`code`);
ALTER TABLE `delivery` ADD CONSTRAINT unique_delivery_contactno UNIQUE (`contactno`);
ALTER TABLE `delivery` ADD CONSTRAINT unique_delivery_permitno UNIQUE (`permitno`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_nic UNIQUE (`nic`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_mobile UNIQUE (`mobile`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_email UNIQUE (`email`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_etfno UNIQUE (`etfno`);
ALTER TABLE `loan` ADD CONSTRAINT unique_loan_code UNIQUE (`code`);
ALTER TABLE `loanrepayment` ADD CONSTRAINT unique_loanrepayment_code UNIQUE (`code`);
ALTER TABLE `material` ADD CONSTRAINT unique_material_code UNIQUE (`code`);
ALTER TABLE `materialdisposal` ADD CONSTRAINT unique_materialdisposal_code UNIQUE (`code`);
ALTER TABLE `materialsubcategory` ADD CONSTRAINT unique_materialsubcategory_code UNIQUE (`code`);
ALTER TABLE `porder` ADD CONSTRAINT unique_porder_code UNIQUE (`code`);
ALTER TABLE `prmaterialreturn` ADD CONSTRAINT unique_prmaterialreturn_code UNIQUE (`code`);
ALTER TABLE `product` ADD CONSTRAINT unique_product_code UNIQUE (`code`);
ALTER TABLE `productdisposal` ADD CONSTRAINT unique_productdisposal_code UNIQUE (`code`);
ALTER TABLE `productsubcategory` ADD CONSTRAINT unique_productsubcategory_code UNIQUE (`code`);
ALTER TABLE `prorder` ADD CONSTRAINT unique_prorder_code UNIQUE (`code`);
ALTER TABLE `purchase` ADD CONSTRAINT unique_purchase_code UNIQUE (`code`);
ALTER TABLE `salary` ADD CONSTRAINT unique_salary_code UNIQUE (`code`);
ALTER TABLE `supplier` ADD CONSTRAINT unique_supplier_code UNIQUE (`code`);
ALTER TABLE `supplier` ADD CONSTRAINT unique_supplier_email UNIQUE (`email`);
ALTER TABLE `supplier` ADD CONSTRAINT unique_supplier_fax UNIQUE (`fax`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_code UNIQUE (`code`);
ALTER TABLE `supplierrefund` ADD CONSTRAINT unique_supplierrefund_code UNIQUE (`code`);
ALTER TABLE `supplierreturn` ADD CONSTRAINT unique_supplierreturn_code UNIQUE (`code`);
ALTER TABLE `vehicle` ADD CONSTRAINT unique_vehicle_code UNIQUE (`code`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_employee_id UNIQUE (`employee_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_username UNIQUE (`username`);
ALTER TABLE `role` ADD CONSTRAINT unique_role_name UNIQUE (`name`);


-- foreign key definitions
ALTER TABLE `advancedpayment` ADD CONSTRAINT f_advancedpayment_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `advancedpayment` ADD CONSTRAINT f_advancedpayment_advancedpaymentstatus_id_fr_advancedpaymentst FOREIGN KEY (`advancedpaymentstatus_id`) REFERENCES `advancedpaymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `advancedpayment` ADD CONSTRAINT f_advancedpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `attendance` ADD CONSTRAINT f_attendance_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `attendance` ADD CONSTRAINT f_attendance_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerorder` ADD CONSTRAINT f_customerorder_customer_id_fr_customer_id FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerorder` ADD CONSTRAINT f_customerorder_customerorderstatus_id_fr_customerorderstatus_id FOREIGN KEY (`customerorderstatus_id`) REFERENCES `customerorderstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerorderproduct` ADD CONSTRAINT f_customerorderproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerorderproduct` ADD CONSTRAINT f_customerorderproduct_customerorder_id_fr_customerorder_id FOREIGN KEY (`customerorder_id`) REFERENCES `customerorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerorder` ADD CONSTRAINT f_customerorder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_customerorder_id_fr_customerorder_id FOREIGN KEY (`customerorder_id`) REFERENCES `customerorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_customerorder_id_fr_customerorder_id FOREIGN KEY (`customerorder_id`) REFERENCES `customerorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefundproduct` ADD CONSTRAINT f_customerrefundproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefundproduct` ADD CONSTRAINT f_customerrefundproduct_customerrefund_id_fr_customerrefund_id FOREIGN KEY (`customerrefund_id`) REFERENCES `customerrefund`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customorderrefunditem` ADD CONSTRAINT f_customorderrefunditem_customerrefund_id_fr_customerrefund_id FOREIGN KEY (`customerrefund_id`) REFERENCES `customerrefund`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customorderitem` ADD CONSTRAINT f_customorderitem_customerorder_id_fr_customerorder_id FOREIGN KEY (`customerorder_id`) REFERENCES `customerorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customorderitem` ADD CONSTRAINT f_customorderitem_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `delivery` ADD CONSTRAINT f_delivery_customerorder_id_fr_customerorder_id FOREIGN KEY (`customerorder_id`) REFERENCES `customerorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `delivery` ADD CONSTRAINT f_delivery_vehicle_id_fr_vehicle_id FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `delivery` ADD CONSTRAINT f_delivery_deliverystatus_id_fr_deliverystatus_id FOREIGN KEY (`deliverystatus_id`) REFERENCES `deliverystatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `deliveryemployee` ADD CONSTRAINT f_deliveryemployee_delivery_id_fr_delivery_id FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `deliveryemployee` ADD CONSTRAINT f_deliveryemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `delivery` ADD CONSTRAINT f_delivery_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_designation_id_fr_designation_id FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_employeestatus_id_fr_employeestatus_id FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loan` ADD CONSTRAINT f_loan_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loan` ADD CONSTRAINT f_loan_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loan` ADD CONSTRAINT f_loan_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loan` ADD CONSTRAINT f_loan_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loanrepayment` ADD CONSTRAINT f_loanrepayment_loan_id_fr_loan_id FOREIGN KEY (`loan_id`) REFERENCES `loan`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `loanrepayment` ADD CONSTRAINT f_loanrepayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialsubcategory_id_fr_materialsubcategory_id FOREIGN KEY (`materialsubcategory_id`) REFERENCES `materialsubcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_unit_id_fr_unit_id FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialstatus_id_fr_materialstatus_id FOREIGN KEY (`materialstatus_id`) REFERENCES `materialstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialdisposalmaterial` ADD CONSTRAINT f_materialdisposalmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialdisposalmaterial` ADD CONSTRAINT f_materialdisposalmaterial_materialdisposal_id_fr_materialdispo FOREIGN KEY (`materialdisposal_id`) REFERENCES `materialdisposal`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialdisposal` ADD CONSTRAINT f_materialdisposal_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialsubcategory` ADD CONSTRAINT f_materialsubcategory_materialcategory_id_fr_materialcategory_id FOREIGN KEY (`materialcategory_id`) REFERENCES `materialcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialsubcategory` ADD CONSTRAINT f_materialsubcategory_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porder` ADD CONSTRAINT f_porder_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `pordermaterial` ADD CONSTRAINT f_pordermaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `pordermaterial` ADD CONSTRAINT f_pordermaterial_porder_id_fr_porder_id FOREIGN KEY (`porder_id`) REFERENCES `porder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porder` ADD CONSTRAINT f_porder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prmaterialreturn` ADD CONSTRAINT f_prmaterialreturn_prorder_id_fr_prorder_id FOREIGN KEY (`prorder_id`) REFERENCES `prorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prmaterialreturnmaterial` ADD CONSTRAINT f_prmaterialreturnmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prmaterialreturnmaterial` ADD CONSTRAINT f_prmaterialreturnmaterial_prmaterialreturn_id_fr_prmaterialret FOREIGN KEY (`prmaterialreturn_id`) REFERENCES `prmaterialreturn`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prmaterialreturn` ADD CONSTRAINT f_prmaterialreturn_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `product` ADD CONSTRAINT f_product_productstatus_id_fr_productstatus_id FOREIGN KEY (`productstatus_id`) REFERENCES `productstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productmaterial` ADD CONSTRAINT f_productmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productmaterial` ADD CONSTRAINT f_productmaterial_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `product` ADD CONSTRAINT f_product_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposalproduct` ADD CONSTRAINT f_productdisposalproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposalproduct` ADD CONSTRAINT f_productdisposalproduct_productdisposal_id_fr_productdisposal_ FOREIGN KEY (`productdisposal_id`) REFERENCES `productdisposal`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposal` ADD CONSTRAINT f_productdisposal_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productsubcategory` ADD CONSTRAINT f_productsubcategory_productcategory_id_fr_productcategory_id FOREIGN KEY (`productcategory_id`) REFERENCES `productcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productsubcategory` ADD CONSTRAINT f_productsubcategory_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorder` ADD CONSTRAINT f_prorder_customorderitem_id_fr_customorderitem_id FOREIGN KEY (`customorderitem_id`) REFERENCES `customorderitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorder` ADD CONSTRAINT f_prorder_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorder` ADD CONSTRAINT f_prorder_prorderstatus_id_fr_prorderstatus_id FOREIGN KEY (`prorderstatus_id`) REFERENCES `prorderstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prordermaterial` ADD CONSTRAINT f_prordermaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prordermaterial` ADD CONSTRAINT f_prordermaterial_prorder_id_fr_prorder_id FOREIGN KEY (`prorder_id`) REFERENCES `prorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorderemployee` ADD CONSTRAINT f_prorderemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorderemployee` ADD CONSTRAINT f_prorderemployee_prorder_id_fr_prorder_id FOREIGN KEY (`prorder_id`) REFERENCES `prorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `prorder` ADD CONSTRAINT f_prorder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_porder_id_fr_porder_id FOREIGN KEY (`porder_id`) REFERENCES `porder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchasematerial` ADD CONSTRAINT f_purchasematerial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchasematerial` ADD CONSTRAINT f_purchasematerial_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salary` ADD CONSTRAINT f_salary_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salaryadvancedpayment` ADD CONSTRAINT f_salaryadvancedpayment_salary_id_fr_salary_id FOREIGN KEY (`salary_id`) REFERENCES `salary`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salaryadvancedpayment` ADD CONSTRAINT f_salaryadvancedpayment_advancedpayment_id_fr_advancedpayment_id FOREIGN KEY (`advancedpayment_id`) REFERENCES `advancedpayment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `allowance` ADD CONSTRAINT f_allowance_salary_id_fr_salary_id FOREIGN KEY (`salary_id`) REFERENCES `salary`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salaryloan` ADD CONSTRAINT f_salaryloan_loan_id_fr_loan_id FOREIGN KEY (`loan_id`) REFERENCES `loan`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salaryloan` ADD CONSTRAINT f_salaryloan_salary_id_fr_salary_id FOREIGN KEY (`salary_id`) REFERENCES `salary`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `deduction` ADD CONSTRAINT f_deduction_salary_id_fr_salary_id FOREIGN KEY (`salary_id`) REFERENCES `salary`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `salary` ADD CONSTRAINT f_salary_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_supplierstatus_id_fr_supplierstatus_id FOREIGN KEY (`supplierstatus_id`) REFERENCES `supplierstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `suppliermaterialcategory` ADD CONSTRAINT f_suppliermaterialcategory_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `suppliermaterialcategory` ADD CONSTRAINT f_suppliermaterialcategory_materialcategory_id_fr_materialcateg FOREIGN KEY (`materialcategory_id`) REFERENCES `materialcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefund` ADD CONSTRAINT f_supplierrefund_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefund` ADD CONSTRAINT f_supplierrefund_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefund` ADD CONSTRAINT f_supplierrefund_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefundmaterial` ADD CONSTRAINT f_supplierrefundmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefundmaterial` ADD CONSTRAINT f_supplierrefundmaterial_supplierrefund_id_fr_supplierrefund_id FOREIGN KEY (`supplierrefund_id`) REFERENCES `supplierrefund`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierrefund` ADD CONSTRAINT f_supplierrefund_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_supplierreturnstatus_id_fr_supplierreturnstatu FOREIGN KEY (`supplierreturnstatus_id`) REFERENCES `supplierreturnstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturnmaterial` ADD CONSTRAINT f_supplierreturnmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturnmaterial` ADD CONSTRAINT f_supplierreturnmaterial_supplierreturn_id_fr_supplierreturn_id FOREIGN KEY (`supplierreturn_id`) REFERENCES `supplierreturn`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_vehiclestatus_id_fr_vehiclestatus_id FOREIGN KEY (`vehiclestatus_id`) REFERENCES `vehiclestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `role` ADD CONSTRAINT f_role_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_usecase_id_fr_usecase_id FOREIGN KEY (`usecase_id`) REFERENCES `usecase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `usecase` ADD CONSTRAINT f_usecase_systemmodule_id_fr_systemmodule_id FOREIGN KEY (`systemmodule_id`) REFERENCES `systemmodule`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `notification` ADD CONSTRAINT f_notification_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `token` ADD CONSTRAINT f_token_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicelog` ADD CONSTRAINT f_servicelog_token_id_fr_token_id FOREIGN KEY (`token_id`) REFERENCES `token`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;

import {User} from './user';
import {Purchase} from './purchase';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Supplierrefundmaterial} from './supplierrefundmaterial';

export class Supplierrefund {
  id: number;
  code: string;
  paymenttype: Paymenttype;
  purchase: Purchase;
  paymentstatus: Paymentstatus;
  date: string;
  amount: number;
  chequeno: string;
  chequebank: string;
  chequebranch: string;
  chequedate: string;
  supplierrefundmaterialList: Supplierrefundmaterial[];
  description: string;
  creator: User;
  tocreation: string;
}

export class SupplierrefundDataPage extends DataPage{
    content: Supplierrefund[];
}

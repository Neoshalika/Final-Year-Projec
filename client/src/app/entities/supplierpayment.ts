import {User} from './user';
import {Purchase} from './purchase';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Supplierpayment {
  id: number;
  code: string;
  purchase: Purchase;
  date: string;
  paymentstatus: Paymentstatus;
  paymenttype: Paymenttype;
  amount: number;
  chequeno: string;
  chequebank: string;
  chequebranch: string;
  chequedate: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class SupplierpaymentDataPage extends DataPage{
    content: Supplierpayment[];
}

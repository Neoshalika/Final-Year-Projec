import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Customerorder} from './customerorder';
import {Paymentstatus} from './paymentstatus';

export class Customerpayment {
  id: number;
  code: string;
  customerorder: Customerorder;
  paymenttype: Paymenttype;
  paymentstatus: Paymentstatus;
  date: string;
  amount: number;
  chequeno: string;
  chequebank: string;
  chequebranch: string;
  chequedate: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class CustomerpaymentDataPage extends DataPage{
    content: Customerpayment[];
}

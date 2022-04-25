import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Customerorder} from './customerorder';
import {Paymentstatus} from './paymentstatus';
import {Customerrefundproduct} from './customerrefundproduct';
import {Customorderrefunditem} from './customorderrefunditem';

export class Customerrefund {
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
  customerrefundproductList: Customerrefundproduct[];
  customorderrefunditemList: Customorderrefunditem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class CustomerrefundDataPage extends DataPage{
    content: Customerrefund[];
}

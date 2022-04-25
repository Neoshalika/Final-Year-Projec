import {User} from './user';
import {Employee} from './employee';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Loan {
  id: number;
  code: string;
  employee: Employee;
  paymenttype: Paymenttype;
  paymentstatus: Paymentstatus;
  date: string;
  amount: number;
  monthlyinstallment: number;
  balance: number;
  chequeno: string;
  chequebank: string;
  chequebranch: string;
  chequedate: string;
  reason: string;
  creator: User;
  tocreation: string;
}

export class LoanDataPage extends DataPage{
    content: Loan[];
}

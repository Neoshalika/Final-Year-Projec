import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Advancedpaymentstatus} from './advancedpaymentstatus';

export class Advancedpayment {
  id: number;
  code: string;
  employee: Employee;
  advancedpaymentstatus: Advancedpaymentstatus;
  date: string;
  amount: number;
  reason: string;
  creator: User;
  tocreation: string;
}

export class AdvancedpaymentDataPage extends DataPage{
    content: Advancedpayment[];
}

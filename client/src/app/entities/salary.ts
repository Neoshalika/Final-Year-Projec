import {User} from './user';
import {Employee} from './employee';
import {Allowance} from './allowance';
import {Deduction} from './deduction';
import {Salaryloan} from './salaryloan';
import {DataPage} from '../shared/data-page';
import {Advancedpayment} from './advancedpayment';

export class Salary {
  id: number;
  code: string;
  employee: Employee;
  month: string;
  date: string;
  epf: number;
  etf: number;
  grossincome: number;
  netsalary: number;
  advancedpaymentList: Advancedpayment[];
  allowanceList: Allowance[];
  salaryloanList: Salaryloan[];
  deductionList: Deduction[];
  description: string;
  creator: User;
  tocreation: string;
}

export class SalaryDataPage extends DataPage{
    content: Salary[];
}

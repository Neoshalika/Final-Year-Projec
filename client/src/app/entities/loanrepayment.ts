import {Loan} from './loan';
import {User} from './user';
import {DataPage} from '../shared/data-page';

export class Loanrepayment {
  id: number;
  code: string;
  loan: Loan;
  date: string;
  amount: number;
  description: string;
  creator: User;
  tocreation: string;
}

export class LoanrepaymentDataPage extends DataPage{
    content: Loanrepayment[];
}

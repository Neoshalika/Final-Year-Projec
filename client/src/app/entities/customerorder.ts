import {User} from './user';
import {Customer} from './customer';
import {DataPage} from '../shared/data-page';
import {Customerorderstatus} from './customerorderstatus';
import {Customerorderproduct} from './customerorderproduct';

export class Customerorder {
  id: number;
  code: string;
  customer: Customer;
  customerorderstatus: Customerorderstatus;
  doordered: string;
  dorequired: string;
  dofinished: string;
  dohandovered: string;
  discount: number;
  deliverycost: number;
  total: number;
  balance: number;
  customerorderproductList: Customerorderproduct[];
  description: string;
  creator: User;
  tocreation: string;
}

export class CustomerorderDataPage extends DataPage{
    content: Customerorder[];
}

import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Customerorder} from './customerorder';

export class Customorderitem {
  id: number;
  code: string;
  customerorder: Customerorder;
  qty: number;
  unitprice: number;
  name: string;
  document: string;
  creator: User;
  tocreation: string;
}

export class CustomorderitemDataPage extends DataPage{
    content: Customorderitem[];
}

import {User} from './user';
import {Porder} from './porder';
import {Supplier} from './supplier';
import {DataPage} from '../shared/data-page';
import {Purchasematerial} from './purchasematerial';

export class Purchase {
  id: number;
  code: string;
  supplier: Supplier;
  porder: Porder;
  date: string;
  total: number;
  purchasematerialList: Purchasematerial[];
  description: string;
  creator: User;
  tocreation: string;
}

export class PurchaseDataPage extends DataPage{
    content: Purchase[];
}

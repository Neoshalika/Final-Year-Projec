import {User} from './user';
import {Product} from './product';
import {DataPage} from '../shared/data-page';
import {Prorderstatus} from './prorderstatus';
import {Customorderitem} from './customorderitem';
import {Prordermaterial} from './prordermaterial';
import {Prorderemployee} from './prorderemployee';

export class Prorder {
  id: number;
  code: string;
  customorderitem: Customorderitem;
  product: Product;
  qty: number;
  dostart: string;
  deadline: string;
  doend: string;
  prorderstatus: Prorderstatus;
  prordermaterialList: Prordermaterial[];
  prorderemployeeList: Prorderemployee[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ProrderDataPage extends DataPage{
    content: Prorder[];
}

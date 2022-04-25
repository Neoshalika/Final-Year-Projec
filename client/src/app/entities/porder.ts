import {User} from './user';
import {Supplier} from './supplier';
import {DataPage} from '../shared/data-page';
import {Pordermaterial} from './pordermaterial';

export class Porder {
  id: number;
  code: string;
  supplier: Supplier;
  doordered: string;
  dorequired: string;
  dorecived: string;
  pordermaterialList: Pordermaterial[];
  description: string;
  creator: User;
  tocreation: string;
}

export class PorderDataPage extends DataPage{
    content: Porder[];
}

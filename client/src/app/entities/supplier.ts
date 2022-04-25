import {User} from './user';
import {Nametitle} from './nametitle';
import {DataPage} from '../shared/data-page';
import {Supplierstatus} from './supplierstatus';
import {Materialcategory} from './materialcategory';

export class Supplier {
  id: number;
  code: string;
  name: string;
  supplierstatus: Supplierstatus;
  email: string;
  fax: string;
  contact1: string;
  contact2: string;
  address: string;
  materialcategoryList: Materialcategory[];
  description: string;
  creator: User;
  tocreation: string;
}

export class SupplierDataPage extends DataPage{
    content: Supplier[];
}

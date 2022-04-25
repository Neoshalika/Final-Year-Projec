import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Productcategory} from './productcategory';

export class Productsubcategory {
  id: number;
  code: string;
  productcategory: Productcategory;
  name: string;
  creator: User;
  tocreation: string;
}

export class ProductsubcategoryDataPage extends DataPage{
    content: Productsubcategory[];
}

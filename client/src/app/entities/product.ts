import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Productstatus} from './productstatus';
import {Productmaterial} from './productmaterial';
import {Productsubcategory} from './productsubcategory';

export class Product {
  id: number;
  code: string;
  name: string;
  productstatus: Productstatus;
  photo: string;
  qty: number;
  unitprice: number;
  rpqty: number;
  productmaterialList: Productmaterial[];
  productsubcategory: Productsubcategory;
  description: string;
  creator: User;
  tocreation: string;
}

export class ProductDataPage extends DataPage{
    content: Product[];
}

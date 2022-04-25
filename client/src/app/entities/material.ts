import {Unit} from './unit';
import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Materialstatus} from './materialstatus';
import {Materialsubcategory} from './materialsubcategory';

export class Material {
  id: number;
  code: string;
  materialsubcategory: Materialsubcategory;
  unit: Unit;
  name: string;
  qty: number;
  rop: number;
  lastprice: number;
  oneunitprice: number;
  materialstatus: Materialstatus;
  photo: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class MaterialDataPage extends DataPage{
    content: Material[];
}

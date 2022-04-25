import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Materialcategory} from './materialcategory';

export class Materialsubcategory {
  id: number;
  code: string;
  materialcategory: Materialcategory;
  name: string;
  creator: User;
  tocreation: string;
}

export class MaterialsubcategoryDataPage extends DataPage{
    content: Materialsubcategory[];
}

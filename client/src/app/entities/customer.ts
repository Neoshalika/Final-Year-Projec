import {User} from './user';
import {Nametitle} from './nametitle';
import {DataPage} from '../shared/data-page';

export class Customer {
  id: number;
  code: string;
  nametitle: Nametitle;
  name: string;
  primarycontact: string;
  alternatecontact: string;
  email: string;
  fax: string;
  address: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class CustomerDataPage extends DataPage{
    content: Customer[];
}

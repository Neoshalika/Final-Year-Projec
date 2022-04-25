import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Productdisposalproduct} from './productdisposalproduct';

export class Productdisposal {
  id: number;
  code: string;
  reason: string;
  date: string;
  productdisposalproductList: Productdisposalproduct[];
  creator: User;
  tocreation: string;
}

export class ProductdisposalDataPage extends DataPage{
    content: Productdisposal[];
}

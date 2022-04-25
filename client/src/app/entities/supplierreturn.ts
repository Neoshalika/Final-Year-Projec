import {User} from './user';
import {Purchase} from './purchase';
import {DataPage} from '../shared/data-page';
import {Supplierreturnstatus} from './supplierreturnstatus';
import {Supplierreturnmaterial} from './supplierreturnmaterial';

export class Supplierreturn {
  id: number;
  code: string;
  purchase: Purchase;
  supplierreturnstatus: Supplierreturnstatus;
  doreturned: string;
  dorecived: string;
  reason: string;
  supplierreturnmaterialList: Supplierreturnmaterial[];
  creator: User;
  tocreation: string;
}

export class SupplierreturnDataPage extends DataPage{
    content: Supplierreturn[];
}

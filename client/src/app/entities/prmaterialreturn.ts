import {User} from './user';
import {Prorder} from './prorder';
import {DataPage} from '../shared/data-page';
import {Prmaterialreturnmaterial} from './prmaterialreturnmaterial';

export class Prmaterialreturn {
  id: number;
  code: string;
  prorder: Prorder;
  date: string;
  reason: string;
  prmaterialreturnmaterialList: Prmaterialreturnmaterial[];
  creator: User;
  tocreation: string;
}

export class PrmaterialreturnDataPage extends DataPage{
    content: Prmaterialreturn[];
}

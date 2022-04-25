import {User} from './user';
import {Vehicle} from './vehicle';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Customerorder} from './customerorder';
import {Deliverystatus} from './deliverystatus';

export class Delivery {
  id: number;
  code: string;
  customerorder: Customerorder;
  vehicle: Vehicle;
  contactname: string;
  contactno: string;
  permitno: string;
  distance: number;
  deliverystatus: Deliverystatus;
  address: string;
  employeeList: Employee[];
  description: string;
  creator: User;
  tocreation: string;
}

export class DeliveryDataPage extends DataPage{
    content: Delivery[];
}

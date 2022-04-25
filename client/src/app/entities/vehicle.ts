import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Vehiclestatus} from './vehiclestatus';

export class Vehicle {
  id: number;
  code: string;
  no: string;
  brand: string;
  modal: string;
  vehiclestatus: Vehiclestatus;
  photo: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class VehicleDataPage extends DataPage{
    content: Vehicle[];
}

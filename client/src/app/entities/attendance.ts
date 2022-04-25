import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';

export class Attendance {
  id: number;
  code: string;
  employee: Employee;
  date: string;
  toin: string;
  toout: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class AttendanceDataPage extends DataPage{
    content: Attendance[];
}

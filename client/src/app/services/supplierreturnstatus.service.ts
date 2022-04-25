import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Supplierreturnstatus} from '../entities/supplierreturnstatus';

@Injectable({
  providedIn: 'root'
})
export class SupplierreturnstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Supplierreturnstatus[]>{
    const supplierreturnstatuses = await this.http.get<Supplierreturnstatus[]>(ApiManager.getURL('supplierreturnstatuses')).toPromise();
    return supplierreturnstatuses.map((supplierreturnstatus) => Object.assign(new Supplierreturnstatus(), supplierreturnstatus));
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Customerorderstatus} from '../entities/customerorderstatus';

@Injectable({
  providedIn: 'root'
})
export class CustomerorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Customerorderstatus[]>{
    const customerorderstatuses = await this.http.get<Customerorderstatus[]>(ApiManager.getURL('customerorderstatuses')).toPromise();
    return customerorderstatuses.map((customerorderstatus) => Object.assign(new Customerorderstatus(), customerorderstatus));
  }

}

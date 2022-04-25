import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Deliverystatus} from '../entities/deliverystatus';

@Injectable({
  providedIn: 'root'
})
export class DeliverystatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Deliverystatus[]>{
    const deliverystatuses = await this.http.get<Deliverystatus[]>(ApiManager.getURL('deliverystatuses')).toPromise();
    return deliverystatuses.map((deliverystatus) => Object.assign(new Deliverystatus(), deliverystatus));
  }

}

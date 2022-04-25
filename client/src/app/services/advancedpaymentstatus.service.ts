import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Advancedpaymentstatus} from '../entities/advancedpaymentstatus';

@Injectable({
  providedIn: 'root'
})
export class AdvancedpaymentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Advancedpaymentstatus[]>{
    const advancedpaymentstatuses = await this.http.get<Advancedpaymentstatus[]>(ApiManager.getURL('advancedpaymentstatuses')).toPromise();
    return advancedpaymentstatuses.map((advancedpaymentstatus) => Object.assign(new Advancedpaymentstatus(), advancedpaymentstatus));
  }

}

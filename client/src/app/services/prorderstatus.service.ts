import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Prorderstatus} from '../entities/prorderstatus';

@Injectable({
  providedIn: 'root'
})
export class ProrderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Prorderstatus[]>{
    const prorderstatuses = await this.http.get<Prorderstatus[]>(ApiManager.getURL('prorderstatuses')).toPromise();
    return prorderstatuses.map((prorderstatus) => Object.assign(new Prorderstatus(), prorderstatus));
  }

}

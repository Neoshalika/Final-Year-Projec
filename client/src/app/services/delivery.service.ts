import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Delivery, DeliveryDataPage} from '../entities/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DeliveryDataPage>{
    const url = pageRequest.getPageRequestURL('deliveries');
    const deliveryDataPage = await this.http.get<DeliveryDataPage>(ApiManager.getURL(url)).toPromise();
    deliveryDataPage.content = deliveryDataPage.content.map((delivery) => Object.assign(new Delivery(), delivery));
    return deliveryDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DeliveryDataPage>{
    const url = pageRequest.getPageRequestURL('deliveries/basic');
    const deliveryDataPage = await this.http.get<DeliveryDataPage>(ApiManager.getURL(url)).toPromise();
    deliveryDataPage.content = deliveryDataPage.content.map((delivery) => Object.assign(new Delivery(), delivery));
    return deliveryDataPage;
  }

  async get(id: number): Promise<Delivery>{
    const delivery: Delivery = await this.http.get<Delivery>(ApiManager.getURL(`deliveries/${id}`)).toPromise();
    return Object.assign(new Delivery(), delivery);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`deliveries/${id}`)).toPromise();
  }

  async add(delivery: Delivery): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`deliveries`), delivery).toPromise();
  }

  async update(id: number, delivery: Delivery): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`deliveries/${id}`), delivery).toPromise();
  }

}

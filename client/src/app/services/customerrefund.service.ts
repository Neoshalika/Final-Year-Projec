import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Customerrefund, CustomerrefundDataPage} from '../entities/customerrefund';

@Injectable({
  providedIn: 'root'
})
export class CustomerrefundService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CustomerrefundDataPage>{
    const url = pageRequest.getPageRequestURL('customerrefunds');
    const customerrefundDataPage = await this.http.get<CustomerrefundDataPage>(ApiManager.getURL(url)).toPromise();
    customerrefundDataPage.content = customerrefundDataPage.content.map((customerrefund) => Object.assign(new Customerrefund(), customerrefund));
    return customerrefundDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CustomerrefundDataPage>{
    const url = pageRequest.getPageRequestURL('customerrefunds/basic');
    const customerrefundDataPage = await this.http.get<CustomerrefundDataPage>(ApiManager.getURL(url)).toPromise();
    customerrefundDataPage.content = customerrefundDataPage.content.map((customerrefund) => Object.assign(new Customerrefund(), customerrefund));
    return customerrefundDataPage;
  }

  async get(id: number): Promise<Customerrefund>{
    const customerrefund: Customerrefund = await this.http.get<Customerrefund>(ApiManager.getURL(`customerrefunds/${id}`)).toPromise();
    return Object.assign(new Customerrefund(), customerrefund);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`customerrefunds/${id}`)).toPromise();
  }

  async add(customerrefund: Customerrefund): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`customerrefunds`), customerrefund).toPromise();
  }

  async update(id: number, customerrefund: Customerrefund): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`customerrefunds/${id}`), customerrefund).toPromise();
  }

}

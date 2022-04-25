import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Customerorder, CustomerorderDataPage} from '../entities/customerorder';
import {Customorderitem} from '../entities/customorderitem';

@Injectable({
  providedIn: 'root'
})
export class CustomerorderService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CustomerorderDataPage>{
    const url = pageRequest.getPageRequestURL('customerorders');
    const customerorderDataPage = await this.http.get<CustomerorderDataPage>(ApiManager.getURL(url)).toPromise();
    customerorderDataPage.content = customerorderDataPage.content.map((customerorder) => Object.assign(new Customerorder(), customerorder));
    return customerorderDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CustomerorderDataPage>{
    const url = pageRequest.getPageRequestURL('customerorders/basic');
    const customerorderDataPage = await this.http.get<CustomerorderDataPage>(ApiManager.getURL(url)).toPromise();
    customerorderDataPage.content = customerorderDataPage.content.map((customerorder) => Object.assign(new Customerorder(), customerorder));
    return customerorderDataPage;
  }

  async get(id: number): Promise<Customerorder>{
    const customerorder: Customerorder = await this.http.get<Customerorder>(ApiManager.getURL(`customerorders/${id}`)).toPromise();
    return Object.assign(new Customerorder(), customerorder);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`customerorders/${id}`)).toPromise();
  }

  async add(customerorder: Customerorder): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`customerorders`), customerorder).toPromise();
  }

  async update(id: number, customerorder: Customerorder): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`customerorders/${id}`), customerorder).toPromise();
  }

  async getAllForcustomOrderItem(): Promise<Customerorder[]>{
    let customerorderDataPage = await this.http.get<Customerorder[]>(ApiManager.getURL('customerorders/forcustomorderitem')).toPromise();
    customerorderDataPage = customerorderDataPage.map((customerorder) => Object.assign(new Customerorder(), customerorder));
    return customerorderDataPage;
  }

  async getAllForPaymentByCustomer(id: number): Promise<Customerorder[]>{
    let customerorderDataPage = await this.http.get<Customerorder[]>(ApiManager.getURL(`customerorders/forpaymentbycustomer/${id}`)).toPromise();
    customerorderDataPage = customerorderDataPage.map((customerorder) => Object.assign(new Customerorder(), customerorder));
    return customerorderDataPage;
  }

  async getAllByCustomer(id: number): Promise<Customerorder[]>{
    let customerorderDataPage = await this.http.get<Customerorder[]>(ApiManager.getURL(`customerorders/bycustomer/${id}`)).toPromise();
    customerorderDataPage = customerorderDataPage.map((customerorder) => Object.assign(new Customerorder(), customerorder));
    return customerorderDataPage;
  }

}

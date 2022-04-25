import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Advancedpayment, AdvancedpaymentDataPage} from '../entities/advancedpayment';

@Injectable({
  providedIn: 'root'
})
export class AdvancedpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<AdvancedpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('advancedpayments');
    const advancedpaymentDataPage = await this.http.get<AdvancedpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    advancedpaymentDataPage.content = advancedpaymentDataPage.content.map((advancedpayment) => Object.assign(new Advancedpayment(), advancedpayment));
    return advancedpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<AdvancedpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('advancedpayments/basic');
    const advancedpaymentDataPage = await this.http.get<AdvancedpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    advancedpaymentDataPage.content = advancedpaymentDataPage.content.map((advancedpayment) => Object.assign(new Advancedpayment(), advancedpayment));
    return advancedpaymentDataPage;
  }

  async get(id: number): Promise<Advancedpayment>{
    const advancedpayment: Advancedpayment = await this.http.get<Advancedpayment>(ApiManager.getURL(`advancedpayments/${id}`)).toPromise();
    return Object.assign(new Advancedpayment(), advancedpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`advancedpayments/${id}`)).toPromise();
  }

  async add(advancedpayment: Advancedpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`advancedpayments`), advancedpayment).toPromise();
  }

  async update(id: number, advancedpayment: Advancedpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`advancedpayments/${id}`), advancedpayment).toPromise();
  }

}

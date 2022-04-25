import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Loanrepayment, LoanrepaymentDataPage} from '../entities/loanrepayment';

@Injectable({
  providedIn: 'root'
})
export class LoanrepaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<LoanrepaymentDataPage>{
    const url = pageRequest.getPageRequestURL('loanrepayments');
    const loanrepaymentDataPage = await this.http.get<LoanrepaymentDataPage>(ApiManager.getURL(url)).toPromise();
    loanrepaymentDataPage.content = loanrepaymentDataPage.content.map((loanrepayment) => Object.assign(new Loanrepayment(), loanrepayment));
    return loanrepaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<LoanrepaymentDataPage>{
    const url = pageRequest.getPageRequestURL('loanrepayments/basic');
    const loanrepaymentDataPage = await this.http.get<LoanrepaymentDataPage>(ApiManager.getURL(url)).toPromise();
    loanrepaymentDataPage.content = loanrepaymentDataPage.content.map((loanrepayment) => Object.assign(new Loanrepayment(), loanrepayment));
    return loanrepaymentDataPage;
  }

  async get(id: number): Promise<Loanrepayment>{
    const loanrepayment: Loanrepayment = await this.http.get<Loanrepayment>(ApiManager.getURL(`loanrepayments/${id}`)).toPromise();
    return Object.assign(new Loanrepayment(), loanrepayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`loanrepayments/${id}`)).toPromise();
  }

  async add(loanrepayment: Loanrepayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`loanrepayments`), loanrepayment).toPromise();
  }

  async update(id: number, loanrepayment: Loanrepayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`loanrepayments/${id}`), loanrepayment).toPromise();
  }

}

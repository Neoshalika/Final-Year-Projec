import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {Loan, LoanDataPage} from '../entities/loan';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<LoanDataPage>{
    const url = pageRequest.getPageRequestURL('loans');
    const loanDataPage = await this.http.get<LoanDataPage>(ApiManager.getURL(url)).toPromise();
    loanDataPage.content = loanDataPage.content.map((loan) => Object.assign(new Loan(), loan));
    return loanDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<LoanDataPage>{
    const url = pageRequest.getPageRequestURL('loans/basic');
    const loanDataPage = await this.http.get<LoanDataPage>(ApiManager.getURL(url)).toPromise();
    loanDataPage.content = loanDataPage.content.map((loan) => Object.assign(new Loan(), loan));
    return loanDataPage;
  }

  async get(id: number): Promise<Loan>{
    const loan: Loan = await this.http.get<Loan>(ApiManager.getURL(`loans/${id}`)).toPromise();
    return Object.assign(new Loan(), loan);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`loans/${id}`)).toPromise();
  }

  async add(loan: Loan): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`loans`), loan).toPromise();
  }

  async update(id: number, loan: Loan): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`loans/${id}`), loan).toPromise();
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Prmaterialreturn, PrmaterialreturnDataPage} from '../entities/prmaterialreturn';

@Injectable({
  providedIn: 'root'
})
export class PrmaterialreturnService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PrmaterialreturnDataPage>{
    const url = pageRequest.getPageRequestURL('prmaterialreturns');
    const prmaterialreturnDataPage = await this.http.get<PrmaterialreturnDataPage>(ApiManager.getURL(url)).toPromise();
    prmaterialreturnDataPage.content = prmaterialreturnDataPage.content.map((prmaterialreturn) => Object.assign(new Prmaterialreturn(), prmaterialreturn));
    return prmaterialreturnDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PrmaterialreturnDataPage>{
    const url = pageRequest.getPageRequestURL('prmaterialreturns/basic');
    const prmaterialreturnDataPage = await this.http.get<PrmaterialreturnDataPage>(ApiManager.getURL(url)).toPromise();
    prmaterialreturnDataPage.content = prmaterialreturnDataPage.content.map((prmaterialreturn) => Object.assign(new Prmaterialreturn(), prmaterialreturn));
    return prmaterialreturnDataPage;
  }

  async get(id: number): Promise<Prmaterialreturn>{
    const prmaterialreturn: Prmaterialreturn = await this.http.get<Prmaterialreturn>(ApiManager.getURL(`prmaterialreturns/${id}`)).toPromise();
    return Object.assign(new Prmaterialreturn(), prmaterialreturn);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`prmaterialreturns/${id}`)).toPromise();
  }

  async add(prmaterialreturn: Prmaterialreturn): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`prmaterialreturns`), prmaterialreturn).toPromise();
  }

  async update(id: number, prmaterialreturn: Prmaterialreturn): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`prmaterialreturns/${id}`), prmaterialreturn).toPromise();
  }

}

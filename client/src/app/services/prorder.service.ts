import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Prorder, ProrderDataPage} from '../entities/prorder';

@Injectable({
  providedIn: 'root'
})
export class ProrderService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProrderDataPage>{
    const url = pageRequest.getPageRequestURL('prorders');
    const prorderDataPage = await this.http.get<ProrderDataPage>(ApiManager.getURL(url)).toPromise();
    prorderDataPage.content = prorderDataPage.content.map((prorder) => Object.assign(new Prorder(), prorder));
    return prorderDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProrderDataPage>{
    const url = pageRequest.getPageRequestURL('prorders/basic');
    const prorderDataPage = await this.http.get<ProrderDataPage>(ApiManager.getURL(url)).toPromise();
    prorderDataPage.content = prorderDataPage.content.map((prorder) => Object.assign(new Prorder(), prorder));
    return prorderDataPage;
  }

  async get(id: number): Promise<Prorder>{
    const prorder: Prorder = await this.http.get<Prorder>(ApiManager.getURL(`prorders/${id}`)).toPromise();
    return Object.assign(new Prorder(), prorder);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`prorders/${id}`)).toPromise();
  }

  async add(prorder: Prorder): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`prorders`), prorder).toPromise();
  }

  async update(id: number, prorder: Prorder): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`prorders/${id}`), prorder).toPromise();
  }

}

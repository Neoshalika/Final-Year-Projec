import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Customorderitem, CustomorderitemDataPage} from '../entities/customorderitem';

@Injectable({
  providedIn: 'root'
})
export class CustomorderitemService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CustomorderitemDataPage>{
    const url = pageRequest.getPageRequestURL('customorderitems');
    const customorderitemDataPage = await this.http.get<CustomorderitemDataPage>(ApiManager.getURL(url)).toPromise();
    customorderitemDataPage.content = customorderitemDataPage.content.map((customorderitem) => Object.assign(new Customorderitem(), customorderitem));
    return customorderitemDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CustomorderitemDataPage>{
    const url = pageRequest.getPageRequestURL('customorderitems/basic');
    const customorderitemDataPage = await this.http.get<CustomorderitemDataPage>(ApiManager.getURL(url)).toPromise();
    customorderitemDataPage.content = customorderitemDataPage.content.map((customorderitem) => Object.assign(new Customorderitem(), customorderitem));
    return customorderitemDataPage;
  }

  async get(id: number): Promise<Customorderitem>{
    const customorderitem: Customorderitem = await this.http.get<Customorderitem>(ApiManager.getURL(`customorderitems/${id}`)).toPromise();
    return Object.assign(new Customorderitem(), customorderitem);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`customorderitems/${id}`)).toPromise();
  }

  async add(customorderitem: Customorderitem): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`customorderitems`), customorderitem).toPromise();
  }

  async update(id: number, customorderitem: Customorderitem): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`customorderitems/${id}`), customorderitem).toPromise();
  }

  async getAllForProduction(pageRequest: PageRequest): Promise<Customorderitem[]>{
    const url = pageRequest.getPageRequestURL('customorderitems/forproduction');
    let customorderitemDataPage = await this.http.get<Customorderitem[]>(ApiManager.getURL(url)).toPromise();
    customorderitemDataPage = customorderitemDataPage.map((customorderitem) => Object.assign(new Customorderitem(), customorderitem));
    return customorderitemDataPage;
  }



}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Supplierrefund, SupplierrefundDataPage} from '../entities/supplierrefund';

@Injectable({
  providedIn: 'root'
})
export class SupplierrefundService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<SupplierrefundDataPage>{
    const url = pageRequest.getPageRequestURL('supplierrefunds');
    const supplierrefundDataPage = await this.http.get<SupplierrefundDataPage>(ApiManager.getURL(url)).toPromise();
    supplierrefundDataPage.content = supplierrefundDataPage.content.map((supplierrefund) => Object.assign(new Supplierrefund(), supplierrefund));
    return supplierrefundDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<SupplierrefundDataPage>{
    const url = pageRequest.getPageRequestURL('supplierrefunds/basic');
    const supplierrefundDataPage = await this.http.get<SupplierrefundDataPage>(ApiManager.getURL(url)).toPromise();
    supplierrefundDataPage.content = supplierrefundDataPage.content.map((supplierrefund) => Object.assign(new Supplierrefund(), supplierrefund));
    return supplierrefundDataPage;
  }

  async get(id: number): Promise<Supplierrefund>{
    const supplierrefund: Supplierrefund = await this.http.get<Supplierrefund>(ApiManager.getURL(`supplierrefunds/${id}`)).toPromise();
    return Object.assign(new Supplierrefund(), supplierrefund);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`supplierrefunds/${id}`)).toPromise();
  }

  async add(supplierrefund: Supplierrefund): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`supplierrefunds`), supplierrefund).toPromise();
  }

  async update(id: number, supplierrefund: Supplierrefund): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`supplierrefunds/${id}`), supplierrefund).toPromise();
  }

}

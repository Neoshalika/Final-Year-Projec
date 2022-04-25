import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Productdisposal, ProductdisposalDataPage} from '../entities/productdisposal';

@Injectable({
  providedIn: 'root'
})
export class ProductdisposalService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProductdisposalDataPage>{
    const url = pageRequest.getPageRequestURL('productdisposals');
    const productdisposalDataPage = await this.http.get<ProductdisposalDataPage>(ApiManager.getURL(url)).toPromise();
    productdisposalDataPage.content = productdisposalDataPage.content.map((productdisposal) => Object.assign(new Productdisposal(), productdisposal));
    return productdisposalDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProductdisposalDataPage>{
    const url = pageRequest.getPageRequestURL('productdisposals/basic');
    const productdisposalDataPage = await this.http.get<ProductdisposalDataPage>(ApiManager.getURL(url)).toPromise();
    productdisposalDataPage.content = productdisposalDataPage.content.map((productdisposal) => Object.assign(new Productdisposal(), productdisposal));
    return productdisposalDataPage;
  }

  async get(id: number): Promise<Productdisposal>{
    const productdisposal: Productdisposal = await this.http.get<Productdisposal>(ApiManager.getURL(`productdisposals/${id}`)).toPromise();
    return Object.assign(new Productdisposal(), productdisposal);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`productdisposals/${id}`)).toPromise();
  }

  async add(productdisposal: Productdisposal): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`productdisposals`), productdisposal).toPromise();
  }

  async update(id: number, productdisposal: Productdisposal): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`productdisposals/${id}`), productdisposal).toPromise();
  }

}

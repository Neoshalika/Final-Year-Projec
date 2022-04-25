import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Productsubcategory, ProductsubcategoryDataPage} from '../entities/productsubcategory';

@Injectable({
  providedIn: 'root'
})
export class ProductsubcategoryService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProductsubcategoryDataPage>{
    const url = pageRequest.getPageRequestURL('productsubcategories');
    const productsubcategoryDataPage = await this.http.get<ProductsubcategoryDataPage>(ApiManager.getURL(url)).toPromise();
    productsubcategoryDataPage.content = productsubcategoryDataPage.content.map((productsubcategory) => Object.assign(new Productsubcategory(), productsubcategory));
    return productsubcategoryDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProductsubcategoryDataPage>{
    const url = pageRequest.getPageRequestURL('productsubcategories/basic');
    const productsubcategoryDataPage = await this.http.get<ProductsubcategoryDataPage>(ApiManager.getURL(url)).toPromise();
    productsubcategoryDataPage.content = productsubcategoryDataPage.content.map((productsubcategory) => Object.assign(new Productsubcategory(), productsubcategory));
    return productsubcategoryDataPage;
  }

  async get(id: number): Promise<Productsubcategory>{
    const productsubcategory: Productsubcategory = await this.http.get<Productsubcategory>(ApiManager.getURL(`productsubcategories/${id}`)).toPromise();
    return Object.assign(new Productsubcategory(), productsubcategory);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`productsubcategories/${id}`)).toPromise();
  }

  async add(productsubcategory: Productsubcategory): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`productsubcategories`), productsubcategory).toPromise();
  }

  async update(id: number, productsubcategory: Productsubcategory): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`productsubcategories/${id}`), productsubcategory).toPromise();
  }

  async getAllByCategory(id: number): Promise<Productsubcategory[]>{
    let productsubcategoryDataPage = await this.http.get<Productsubcategory[]>(ApiManager.getURL(`productsubcategories/bysubcat/${id}`)).toPromise();
    productsubcategoryDataPage = productsubcategoryDataPage.map((productsubcategory) => Object.assign(new Productsubcategory(), productsubcategory));
    return productsubcategoryDataPage;
  }

}

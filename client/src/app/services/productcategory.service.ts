import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Productcategory} from '../entities/productcategory';

@Injectable({
  providedIn: 'root'
})
export class ProductcategoryService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Productcategory[]>{
    const productcategories = await this.http.get<Productcategory[]>(ApiManager.getURL('productcategories')).toPromise();
    return productcategories.map((productcategory) => Object.assign(new Productcategory(), productcategory));
  }

}

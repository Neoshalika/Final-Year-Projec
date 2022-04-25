import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Materialcategory} from '../entities/materialcategory';

@Injectable({
  providedIn: 'root'
})
export class MaterialcategoryService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Materialcategory[]>{
    const materialcategories = await this.http.get<Materialcategory[]>(ApiManager.getURL('materialcategories')).toPromise();
    return materialcategories.map((materialcategory) => Object.assign(new Materialcategory(), materialcategory));
  }

}

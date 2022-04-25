import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Materialsubcategory, MaterialsubcategoryDataPage} from '../entities/materialsubcategory';

@Injectable({
  providedIn: 'root'
})
export class MaterialsubcategoryService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<MaterialsubcategoryDataPage>{
    const url = pageRequest.getPageRequestURL('materialsubcategories');
    const materialsubcategoryDataPage = await this.http.get<MaterialsubcategoryDataPage>(ApiManager.getURL(url)).toPromise();
    materialsubcategoryDataPage.content = materialsubcategoryDataPage.content.map((materialsubcategory) => Object.assign(new Materialsubcategory(), materialsubcategory));
    return materialsubcategoryDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<MaterialsubcategoryDataPage>{
    const url = pageRequest.getPageRequestURL('materialsubcategories/basic');
    const materialsubcategoryDataPage = await this.http.get<MaterialsubcategoryDataPage>(ApiManager.getURL(url)).toPromise();
    materialsubcategoryDataPage.content = materialsubcategoryDataPage.content.map((materialsubcategory) => Object.assign(new Materialsubcategory(), materialsubcategory));
    return materialsubcategoryDataPage;
  }

  async get(id: number): Promise<Materialsubcategory>{
    const materialsubcategory: Materialsubcategory = await this.http.get<Materialsubcategory>(ApiManager.getURL(`materialsubcategories/${id}`)).toPromise();
    return Object.assign(new Materialsubcategory(), materialsubcategory);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`materialsubcategories/${id}`)).toPromise();
  }

  async add(materialsubcategory: Materialsubcategory): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`materialsubcategories`), materialsubcategory).toPromise();
  }

  async update(id: number, materialsubcategory: Materialsubcategory): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`materialsubcategories/${id}`), materialsubcategory).toPromise();
  }

}

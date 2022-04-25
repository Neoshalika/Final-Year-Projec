import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  async getYearWiseEmployeeCount(count: number): Promise<any[]>{
    const url = ApiManager.getURL('reports/year-wise-employee-count/' + count) ;
    return await this.http.get<any>(url).toPromise();
  }
  async getYearWisePurchaseCount(count: number): Promise<any[]>{
    const url = ApiManager.getURL('reports/year-wise-purchase-count/' + count) ;
    return await this.http.get<any>(url).toPromise();
  }
  async getMonthWiseEmployeeCount(count: number): Promise<any[]>{
    const url = ApiManager.getURL('reports/Month-wise-employee-count/' + count) ;
    return await this.http.get<any>(url).toPromise();
  }
}

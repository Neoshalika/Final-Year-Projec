import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../shared/abstract-component';
import {Employee} from '../../entities/employee';
import {Product, ProductDataPage} from '../../entities/product';
import {ChartOptions, ChartDataSets, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportService} from '../../services/report.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductService} from '../../services/product.service';
import {PageRequest} from '../../shared/page-request';
import {Material, MaterialDataPage} from '../../entities/material';
import {MaterialService} from '../../services/material.service';

class Service {
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  extends AbstractComponent implements OnInit {

  products: Product[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {display: false}
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public lineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
  },
  ];

  public barChartData: { data: any[]; label: string }[] = [
    {data: [], label: 'Material Count'}
  ];
  servicesDisplayedColumns: string[];
  printordersDervicesDisplayedColumns: string[];
  billPayments: number;
  rentalPayments: number;
  concumePayments: number;
  servicePayments: number;

  public IbarChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false }
  };
  public IbarChartLabels: Label[] = [];
  public IbarChartType: ChartType = 'horizontalBar';
  public IbarChartLegend = true;
  public IbarChartPlugins = [];
  public IlineChartColors: Color[] = [{
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  ];
  Idata: any[] = [];
  public IbarChartData: ChartDataSets[] = [
    { data: [], label: 'Count' }
  ];
  private Idatapage: ProductDataPage;
  private datapage: MaterialDataPage;
  private data: Material[];


  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private materialService: MaterialService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }


  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  updatePrivileges(): any {
  }


  async loadData(): Promise<any> {
    this.datapage = await this.materialService.getAll(new PageRequest());
    this.data = this.datapage.content;

    this.barChartLabels = [];
    this.barChartData[0].data = [];

    for (const d of this.Idata){
      this.barChartLabels.push(d.name);
      this.barChartData[0].data.push(d.qty);
    }

    this.Idatapage = await this.productService.getAll(new PageRequest());
    this.Idata = this.Idatapage.content;


    this.IbarChartLabels = [];
    this.IbarChartData[0].data = [];

    for (const d of this.data){
      this.IbarChartLabels.push(d.name);
      this.IbarChartData[0].data.push(d.qty);
    }
  }
}

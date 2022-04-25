 import { Component, OnInit } from '@angular/core';
 import {AbstractComponent} from '../../../../shared/abstract-component';
 import {ReportService} from '../../../../services/report.service';
 import {ChartDataSets, ChartOptions} from 'chart.js';
 import {Color, Label} from 'ng2-charts';
 import {ReportHelper} from '../../../../shared/report-helper';
 import {FormControl, FormGroup, Validators} from '@angular/forms';

 @Component({
  selector: 'app-year-wise-employee-count',
  templateUrl: './year-wise-employee-count.component.html',
  styleUrls: ['./year-wise-employee-count.component.scss']
})
export class YearWiseEmployeeCountComponent extends AbstractComponent implements OnInit {

   years = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  yearWiseData: any[];
   public lineChartData: ChartDataSets[] = [
     { data: [this.yearWiseData] },
   ];
   public lineChartLabels: Label[] = [];
   public lineChartOptions = {
     responsive: true,
     maintainAspectRatio: false,
   };

   form = new FormGroup({
     year: new FormControl(10),
   });

   get yearField(): FormControl{
     return this.form.controls.year as FormControl;
   }

   public lineChartColors: Color[] = [
     {
       borderColor: 'black',
       backgroundColor: 'rgba(0,0,255,0.3)',
     },
   ];
   public lineChartLegend = true;
   public lineChartType = 'line';
   public lineChartPlugins = [];

   displayedColumns: string[] = ['year', 'count'];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<any>{
    this.yearWiseData = await this.reportService.getYearWisePurchaseCount(this.yearField.value);

    this.lineChartLabels = [];
    this.yearWiseData[0].data = [];
    for (const yearData of this.yearWiseData){
      this.lineChartLabels.unshift(yearData.year);
      this.lineChartData[0].data.unshift(yearData.count);

    }
  }

  updatePrivileges(): any {
  }

  print(): void{
    ReportHelper.print('yearWiseEmployeeReport');
  }

 }

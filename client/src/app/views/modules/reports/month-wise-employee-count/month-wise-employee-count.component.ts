import { Component, OnInit } from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportService} from '../../../../services/report.service';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-month-wise-employee-count',
  templateUrl: './month-wise-employee-count.component.html',
  styleUrls: ['./month-wise-employee-count.component.scss']
})
export class MonthWiseEmployeeCountComponent extends AbstractComponent implements OnInit {

  monthWiseData: any[];
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Month wise Employee Count' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,0,255,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    // this.refreshData();
  }

  async loadData(): Promise<any>{
    this.monthWiseData = await this.reportService.getMonthWiseEmployeeCount(12);

    this.lineChartLabels = [];
    this.monthWiseData[0].data = [];
    for (const monthViewModel of this.monthWiseData){
      this.lineChartLabels.unshift(monthViewModel.year);
      this.lineChartData[0].data.unshift(monthViewModel.count);

    }
  }

  updatePrivileges(): any {
  }

}

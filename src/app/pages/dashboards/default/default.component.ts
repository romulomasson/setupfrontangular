import { Component, OnInit } from '@angular/core';
import { earningLineChart, salesAnalyticsDonutChart, emailSentBarChart, monthlyEarningChart } from '../data';
import { ChartType, ChatMessage } from '../saas.model';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

 
export class DefaultComponent implements OnInit {
  breadCrumbItems: Array<{}>; 
  earningLineChart: ChartType;
  salesAnalyticsDonutChart: ChartType;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  isActive: string;
  sassEarning: any;
  ngOnInit() { 
    this.breadCrumbItems = [{ label: 'Home' }, { label: 'Dashboard', active: true }];

    this._fetchData();

   

  }

  private _fetchData() {
    this.earningLineChart = earningLineChart;
    this.salesAnalyticsDonutChart = salesAnalyticsDonutChart;
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.isActive = 'year';

    this.sassEarning = [
      {
        name: "Esse mês",
        amount: "R$ 80.000",
        revenue: "0.2",
        time: "Que o mês passado",
        month: "Último mês",
        previousamount: "R$ 78.000",
        series: [
          {
            name: "Quantidade de empréstimo",
            data: [22, 35, 20, 41, 51, 42, 49, 45, 58, 42, 75, 48],
          },
        ],
      },
    ];
  }
}
